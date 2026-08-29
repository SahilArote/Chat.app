import express from 'express';
import {
    sendMessage,
    getMessages,
    deleteMessage,
    reactToMessage,
    markAsRead
} from '../controllers/messageController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.post('/:conversationId', sendMessage);
router.get('/:conversationId', getMessages);
router.delete('/:id', deleteMessage);
router.patch('/:id/react', reactToMessage);
router.patch('/:id/read', markAsRead);

export default router;
