const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const Posts = sequelize.define("Posts", {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  postedBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Posts;
