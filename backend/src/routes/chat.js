const express = require('express');
const { getChats, createChat, getMessages, sendMessage } = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getChats);
router.post('/', auth, createChat);
router.get('/:chatId/messages', auth, getMessages);
router.post('/message', auth, sendMessage);

module.exports = router;
