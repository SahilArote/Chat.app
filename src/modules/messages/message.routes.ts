import express from 'express';
import {
    sendMessage,
    getMessages,
    deleteMessage,
    reactToMessage,
    markAsRead
} from './message.controller';
import { protect } from '../../middleware/auth.middleware';
import validate from '../../middleware/validate.middleware';
import {
    sendMessageSchema,
    getMessagesSchema,
    deleteMessageSchema,
    reactToMessageSchema,
    markAsReadSchema
} from './message.validation';

const router = express.Router();

router.use(protect);

router.post('/:conversationId', validate(sendMessageSchema), sendMessage);
router.get('/:conversationId', validate(getMessagesSchema), getMessages);
router.delete('/:id', validate(deleteMessageSchema), deleteMessage);
router.patch('/:id/react', validate(reactToMessageSchema), reactToMessage);
router.patch('/:id/read', validate(markAsReadSchema), markAsRead);

export default router;
