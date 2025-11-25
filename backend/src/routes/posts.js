const express = require('express');
const { createPost, getPosts, likePost, commentPost } = require('../controllers/postController');
const auth = require('../middleware/auth'); // Assuming auth middleware exists

const router = express.Router();

router.post('/posts', auth, createPost);
router.get('/posts', getPosts);
router.put('/posts/:id/like', auth, likePost);
router.post('/posts/:id/comment', auth, commentPost);

module.exports = router;
