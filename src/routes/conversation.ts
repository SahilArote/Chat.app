import express from 'express';
import {
    createOrGetDM,
    getMyConversations,
    createGroup,
    getConversationById,
    addMember,
    removeMember,
    deleteConversation
} from '../controllers/conversationController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Sab protected hain
router.use(protect);

router.get('/', getMyConversations);
router.post('/', createOrGetDM);
router.post('/group', createGroup);
router.get('/:id', getConversationById);
router.patch('/group/:id/add', addMember);
router.patch('/group/:id/remove', removeMember);
router.delete('/:id', deleteConversation);

export default router;
