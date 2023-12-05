const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const LikedPosts = sequelize.define("LikedPosts", {
  isLiked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = LikedPosts;
