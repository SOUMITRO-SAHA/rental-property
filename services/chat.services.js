const db = require('../config/db');

exports.sendMessage = async (senderId, receiverId, content) => {
  try {
    const existingChat = await db.chat.findFirst({
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

    // Create a new message
    const message = await db.message.create({
      data: {
        content,
        senderId,
        receiverId,
        chatId,
      },
    });

    return { success: true, message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
