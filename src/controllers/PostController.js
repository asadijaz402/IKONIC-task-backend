const Post = require('../models/PostsModel');
const User = require('../models/UserModel');
const LikedPosts = require('../models/LikedPostsModel');

User.hasMany(Post, { foreignKey: 'postedBy' });
Post.belongsTo(User, { foreignKey: 'postedBy' });

User.hasMany(LikedPosts, { foreignKey: 'userId' });
LikedPosts.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(LikedPosts, { foreignKey: 'postId' });
LikedPosts.belongsTo(Post, { foreignKey: 'postId' });

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req.auth.data;

    const post = await Post.create({
      text,
      postedBy: userId,
    });

    const postWithUser = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    res
      .status(200)
      .send({ success: true, message: 'post created', data: postWithUser });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

exports.posts = async (req, res) => {
  try {
    const { userId, type } = req.auth.data;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;


    let condition = {
      limit: parseInt(limit, 10),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
        },
      ],
    };

    // if (type === "user") {
    //   condition["where"] = { postedBy: userId };
    // }

    const posts = await Post.findAndCountAll(condition);  

    res.status(200).send({
      success: true,
      totalPosts: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page,
      posts: posts.rows,
    });
  } catch (error) {
  
    res.status(500).send({ success: false, error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.query;
    const { userId, type } = req.auth.data;
    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).send({
        success: false,
        message: 'Post not found.',
      });
    }

    if (post.postedBy !== userId && type !== 'admin') {
      return res.status(403).send({
        success: false,
        message: 'You are not authorized to delete this post.',
      });
    }

    await post.destroy();

    res.status(200).send({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error, message: 'Internal Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id, text } = req.body;
    const { userId } = req.auth.data;


    const updatedPost = await Post.update(
      {
        text,
      },
      {
        where: {
          id,
          postedBy: userId,
        },
      }
    );


    if (updatedPost[0]) {
      res
        .status(200)
        .send({ success: true, message: 'post updated', data: updatedPost });
    } else {
      res
        .status(200)
        .send({ success: false, message: 'post cannot be updated' });
    }
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

exports.toggledPostLike = async (req, res) => {
  try {
   
    const { userId } = req.auth.data;
    const { postId } = req.body;

    const existingLike = await LikedPosts.findOne({
      where: {
        userId,
        postId,
      },
    });

    if (existingLike) {
      await existingLike.destroy({ id: existingLike.id });
    } else {
      await LikedPosts.create({
        userId,
        postId,
        isLiked: true,
      });
    }

    res.status(200).send({
      success: true,
      message: 'Post toggled successfully',
      // message: isLiked
      //   ? "Post liked successfully"
      //   : "Post disliked successfully",
    });
  } catch (error) {

    res.status(500).send({ success: false, error });
  }
};

exports.postLike = async (req, res) => {
  try {
    

    const postId = req.query.postId;
    const { userId } = req.auth.data;

    const likeCounts = await LikedPosts.count({
      where: {
        postId,
        isLiked: true,
      },
    });

    const userInteraction = await LikedPosts.findOne({
      where: {
        postId,
        userId,
      },
    });

    let interactionStatus = false;

    if (userInteraction) {
      interactionStatus = true;
    }

    res.status(200).send({
      success: true,
      likeCounts,
      interactionStatus,
    });
  } catch (error) {
  
    res.status(500).send({ success: false, error });
  }
};
