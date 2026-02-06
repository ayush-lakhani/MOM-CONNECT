const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    // Assuming req.user.id is set by auth middleware
    const newPost = new Post({
      user: req.user.id,
      content,
      image,
    });

    const savedPost = await newPost.save();
    
    // Update user's post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json({ message: 'Post liked' });
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json({ message: 'Post unliked' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment on a post
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.id,
      text,
    };

    await post.updateOne({ $push: { comments: comment } });
    res.status(200).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Save/Unsave a post
exports.savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    if (user.savedPosts.includes(postId)) {
      await user.updateOne({ $pull: { savedPosts: postId } });
      res.status(200).json({ message: 'Post unsaved', isSaved: false });
    } else {
      await user.updateOne({ $push: { savedPosts: postId } });
      res.status(200).json({ message: 'Post saved', isSaved: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get saved posts
exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedPosts',
      populate: { path: 'user', select: 'name profileImage' }
    });
    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
