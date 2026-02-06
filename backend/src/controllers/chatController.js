const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createChat = async (req, res) => {
  const { participantId } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, participantId]
      });
      await chat.save();
    }
    
    // Populate participants before returning
    await chat.populate('participants', 'name email');
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, content, type } = req.body;
  const io = req.app.get('io');

  try {
    const message = new Message({
      chatId,
      sender: req.user.id,
      content,
      type: type || 'text'
    });
    await message.save();

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    });

    const fullMessage = await message.populate('sender', 'name');

    // Emit to room
    io.to(chatId).emit('receive_message', fullMessage);

    res.json(fullMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
