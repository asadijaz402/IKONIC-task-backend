const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
  // Generate a salt with the specified rounds
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  const hash = await bcrypt.hash(password, salt);

  // Store the hash in the database
  return hash;
};

exports.verifyPassword = async (password, hash) => {
  // Compare the password with the stored hash
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
};
