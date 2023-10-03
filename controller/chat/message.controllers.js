const db = require('../../config/db');
const io = require('../../socket');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await db.directMessage.findMany();
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, senderId, receiverId } = req.body;

  try {
    // Check if chat exists
    const existingChat = await db.directMessage.findFirst({
      where: {
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: receiverId } } },
        ],
      },
    });

    let chatId;
    if (existingChat) {
      // Chat already exists
      chatId = existingChat.id;
    } else {
      // Create a new chat
      const newChat = await db.chat.create({
        data: {
          participants: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      });

      chatId = newChat.id;
    }

    // Saving the message
    const message = await db.directMessage.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
        chat: { connect: { id: chatId } },
      },
    });

    // Emit the message to clients
    io.emit('message', message);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
