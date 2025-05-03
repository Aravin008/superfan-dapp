const express = require('express');
const { getMessages, getMessageById, getMessagesWithReply, getMessageByIdWithReply } = require('../controllers/messageController');
const router = express.Router();

router.get('/list', getMessages);

router.get('/with-replies', getMessagesWithReply);

router.get('/:id', getMessageById);

router.get('/with-reply/:id', getMessageByIdWithReply);


module.exports = router;