import express from 'express';
import {
    createOrGetDM,
    getMyConversations,
    createGroup,
    getConversationById,
    addMember,
    removeMember,
    deleteConversation
} from './conversation.controller';
import { protect } from '../../middleware/auth.middleware';
import validate from '../../middleware/validate.middleware';
import {
    createDMSchema,
    createGroupSchema,
    getConversationByIdSchema,
    addMemberSchema,
    removeMemberSchema,
    deleteConversationSchema
} from './conversation.validation';

const router = express.Router();

router.use(protect);

router.get('/', getMyConversations);
router.post('/', validate(createDMSchema), createOrGetDM);
router.post('/group', validate(createGroupSchema), createGroup);
router.get('/:id', validate(getConversationByIdSchema), getConversationById);
router.patch('/group/:id/add', validate(addMemberSchema), addMember);
router.patch('/group/:id/remove', validate(removeMemberSchema), removeMember);
router.delete('/:id', validate(deleteConversationSchema), deleteConversation);

export default router;
