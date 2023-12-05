const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("Users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    len: [2, 100],
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    len: [2, 100],
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    len: [2, 100],
  },
  profileImage: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    len: [2, 100],
    validate: {
      isIn: [["user", "admin"]],
    },
  },
});

module.exports = User;
