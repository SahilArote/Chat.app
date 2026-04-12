const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    deleteMessage,
    reactToMessage,
    markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/:conversationId', sendMessage);
router.get('/:conversationId', getMessages);
router.delete('/:id', deleteMessage);
router.patch('/:id/react', reactToMessage);
router.patch('/:id/read', markAsRead);

module.exports = router;