const User = require('../models/User');
const Post = require('../models/Post');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get real counts
    const postsCount = await Post.countDocuments({ user: userId });
    
    // Calculate total likes received
    const userPosts = await Post.find({ user: userId });
    const totalLikes = userPosts.reduce((acc, post) => acc + post.likes.length, 0);

    res.status(200).json({
      ...user.toJSON(),
      postsCount,
      totalLikes,
      posts: userPosts, // Return actual posts
      followers: 120, // Placeholder for now
      following: 45,  // Placeholder for now
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, bio, profileImage },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { isVerified: true });
    res.status(200).json({ message: 'User verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
