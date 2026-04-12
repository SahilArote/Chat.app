const express = require('express');
const router = express.Router();
const {
    createOrGetDM,
    getMyConversations,
    createGroup,
    getConversationById,
    addMember,
    removeMember,
    deleteConversation
} = require('../controllers/conversationController');
const { protect } = require('../middlewares/auth');

// Sab protected hain
router.use(protect);

router.get('/', getMyConversations);
router.post('/', createOrGetDM);
router.post('/group', createGroup);
router.get('/:id', getConversationById);
router.patch('/group/:id/add', addMember);
router.patch('/group/:id/remove', removeMember);
router.delete('/:id', deleteConversation);

module.exports = router;