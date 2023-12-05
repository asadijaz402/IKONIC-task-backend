const express = require("express");
const router = express.Router();

const PostController = require("../controllers/PostController");

const { createPost, posts, deletePost, updatePost, toggledPostLike, postLike } =
  PostController;

router.post("/create-post", createPost);
router.post("/update-post", updatePost);

router.get("/posts", posts);

router.delete("/delete-post", deletePost);

router.post("/isliked-post", toggledPostLike);
router.get("/post-likes", postLike);

module.exports = router;
