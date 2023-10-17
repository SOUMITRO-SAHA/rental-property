const db = require('../../config/db');

exports.getAllChats = async (req, res) => {
  try {
    const chats = await db.chat.findMany({
      include: {
        participants: true,
        messages: true,
      },
    });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getChatById = async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await db.chat.findUnique({
      where: { id: parseInt(id) },
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.createChat = async (req, res) => {
  const { name, isGroupChat, description } = req.body;

  try {
    const newChat = await db.chat.create({
      data: {
        name,
        isGroupChat,
        description,
      },
    });

    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
