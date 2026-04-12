const Conversation = require('../models/Conversation');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @route  POST /api/conversations
// @desc   DM create karo ya existing dhundo
const createOrGetDM = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) throw new ApiError(400, 'UserId is required');

    // Apne aap se chat nahi kar sakte
    if (userId === req.user._id.toString()) {
        throw new ApiError(400, 'You cannot chat with yourself');
    }

    // Dusra user exist karta hai?
    const otherUser = await User.findById(userId);
    if (!otherUser) throw new ApiError(404, 'User not found');

    // Pehle se DM exist karta hai?
    let conversation = await Conversation.findOne({
        type: 'dm',
        members: { $all: [req.user._id, userId] }
    })
    .populate('members', 'username avatar status lastSeen')
    .populate('lastMessage');

    // Nahi hai toh naya banao
    if (!conversation) {
        conversation = await Conversation.create({
            type: 'dm',
            members: [req.user._id, userId]
        });

        conversation = await Conversation.findById(conversation._id)
            .populate('members', 'username avatar status lastSeen')
            .populate('lastMessage');
    }

    res.status(200).json({ success: true, conversation });
});

// @route  GET /api/conversations
// @desc   Meri saari conversations fetch karo
const getMyConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        members: req.user._id,
        deletedFor: { $ne: req.user._id }
    })
    .populate('members', 'username avatar status lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 }); // latest pehle

    res.json({ success: true, conversations });
});

// @route  POST /api/conversations/group
// @desc   Group chat banao
const createGroup = asyncHandler(async (req, res) => {
    const { name, members } = req.body;

    if (!name) throw new ApiError(400, 'Group name is required');

    if (!members || members.length < 2) {
        throw new ApiError(400, 'Group must have at least 2 other members');
    }

    // Creator ko bhi members mein daalo
    const allMembers = [...new Set([...members, req.user._id.toString()])];

    const conversation = await Conversation.create({
        type: 'group',
        name,
        members: allMembers,
        admins: [req.user._id] // creator admin hoga
    });

    const populated = await Conversation.findById(conversation._id)
        .populate('members', 'username avatar status lastSeen')
        .populate('admins', 'username avatar');

    res.status(201).json({ success: true, conversation: populated });
});

// @route  GET /api/conversations/:id
// @desc   Single conversation fetch karo
const getConversationById = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({
        _id: req.params.id,
        members: req.user._id
    })
    .populate('members', 'username avatar status lastSeen')
    .populate('admins', 'username avatar')
    .populate('lastMessage');

    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    res.json({ success: true, conversation });
});

// @route  PATCH /api/conversations/group/:id/add
// @desc   Group mein member add karo
const addMember = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) throw new ApiError(404, 'Group not found');
    if (conversation.type !== 'group') throw new ApiError(400, 'Not a group');

    // Sirf admin add kar sakta hai
    if (!conversation.admins.includes(req.user._id)) {
        throw new ApiError(403, 'Only admin can add members');
    }

    // Pehle se member hai?
    if (conversation.members.includes(userId)) {
        throw new ApiError(400, 'User is already a member');
    }

    conversation.members.push(userId);
    await conversation.save();

    const updated = await Conversation.findById(conversation._id)
        .populate('members', 'username avatar status lastSeen');

    res.json({ success: true, conversation: updated });
});

// @route  PATCH /api/conversations/group/:id/remove
// @desc   Group se member remove karo
const removeMember = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) throw new ApiError(404, 'Group not found');

    // Sirf admin remove kar sakta hai
    if (!conversation.admins.includes(req.user._id)) {
        throw new ApiError(403, 'Only admin can remove members');
    }

    // Admin khud ko remove nahi kar sakta
    if (userId === req.user._id.toString()) {
        throw new ApiError(400, 'Admin cannot remove themselves');
    }

    conversation.members = conversation.members.filter(
        m => m.toString() !== userId
    );
    await conversation.save();

    const updated = await Conversation.findById(conversation._id)
        .populate('members', 'username avatar status lastSeen');

    res.json({ success: true, conversation: updated });
});

// @route  DELETE /api/conversations/:id
// @desc   Conversation delete karo (sirf apne liye)
const deleteConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({
        _id: req.params.id,
        members: req.user._id
    });

    if (!conversation) throw new ApiError(404, 'Conversation not found');

    // Sirf apne liye delete karo
    if (!conversation.deletedFor.includes(req.user._id)) {
        conversation.deletedFor.push(req.user._id);
        await conversation.save();
    }

    res.json({ success: true, message: 'Conversation deleted' });
});

module.exports = {
    createOrGetDM,
    getMyConversations,
    createGroup,
    getConversationById,
    addMember,
    removeMember,
    deleteConversation
};