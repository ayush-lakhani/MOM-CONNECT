const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/users', require('../controllers/authController').getAllUsers);
router.put('/profile', require('../middleware/auth'), require('../controllers/authController').updateProfile);

module.exports = router;