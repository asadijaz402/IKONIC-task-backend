const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword } = require('../utility/password');

exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const newPassword = await hashPassword(password);
    const profileImage = req.files['profileImage']
      ? req.files['profileImage'][0].filename
      : null;

    await User.create({
      name,
      email: email.toLowerCase(),
      password: newPassword,
      type: type.toLowerCase(),
      profileImage: '/files/' + profileImage,
    });

    res
      .status(200)
      .send({ success: true, message: 'user registered successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: error.errors[0].message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid credentials' });
    }

    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .send({ success: false, message: 'Invalid credentials' });
    }



    const token = jwt.sign(
      {
        data: { userId: user.dataValues.id, type: user.dataValues.type },
      },
      process.env.JWT_TOKEN_KEY,
      { expiresIn: '2y' }
    );

    const refreshToken = jwt.sign(
      {
        data: { userId: user.dataValues.id, type: user.dataValues.type },
      },
      process.env.JWT_REFRESH_TOKEN_KEY,
      { expiresIn: '7d' }
    );

    return res
      .status(200)
      .send({ success: true, message: 'Login successful', token, user });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, error: 'Internal server error' });
  }
};
