const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { userImageMiddleware } = require("../middlewares/multer");

const { register, login } = AuthController;

router.post("/register", userImageMiddleware, register);

router.post("/login", login);

module.exports = router;
