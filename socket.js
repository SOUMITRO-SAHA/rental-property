const { Server } = require('socket.io');
const databaseOperations = require('./services/chat.services');

async function handleMessage(payload, socket) {
  try {
    // Assuming payload object has senderId, receiverId, and content properties
    const { senderId, receiverId, content } = payload;

    // Send message and create chat if needed
    const result = await databaseOperations.sendMessage(
      senderId,
      receiverId,
      content
    );

    if (result.success) {
      io.emit('message', result.message);
    } else {
      socket.emit('error', 'Error saving message');
    }
  } catch (error) {
    socket.emit('error', 'Error handling message');
  }
}

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: 'ChatApp',
      credentials: true,
    },
  });

  // Socket connection
  io.on('connection', (socket) => {
    console.log('Socket is running...');

    // Send Message
    socket.on('message', (payload) => {
      handleMessage(payload, socket);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
