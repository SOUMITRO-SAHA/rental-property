const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat/chat.controllers');
const messageController = require('../controller/chat/message.controllers');

router
  .get('/', chatController.getAllChats)
  .post('/', chatController.createChat)
  .get('/:id', chatController.getChatById);

router
  .post('/message/send', messageController.sendMessage)
  .get('/message/all', messageController.getAllMessages);

module.exports = router;
