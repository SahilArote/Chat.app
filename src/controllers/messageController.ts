import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Message, { IMessageDocument } from '../models/Message';
import Conversation from '../models/Conversation';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

// @route  POST /api/messages/:conversationId
// @desc   Message bhejo
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversationId = req.params.conversationId as string;
    const { content, type = 'text', replyTo } = req.body;

    // Conversation exist karti hai aur user member hai?
    const conversation = await Conversation.findOne({
        _id: conversationId,
        members: req.user._id
    });

    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    if (!content && type === 'text') {
        throw new ApiError(400, 'Message content is required');
    }

    const message: IMessageDocument = await Message.create({
        conversationId: new Types.ObjectId(conversationId),
        senderId: req.user._id,
        type,
        content: content || '',
        replyTo: replyTo || null
    });

    // Conversation ka lastMessage update karo
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date()
    });

    // Populate karke bhejo
    const populated = await Message.findById(message._id)
        .populate('senderId', 'username avatar')
        .populate('replyTo');

    res.status(201).json({ success: true, message: populated });
});

// @route  GET /api/messages/:conversationId
// @desc   Messages fetch karo with pagination
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversationId = req.params.conversationId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = (page - 1) * limit;

    // User is conversation ka member hai?
    const conversation = await Conversation.findOne({
        _id: conversationId,
        members: req.user._id
    });

    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    const messages = await Message.find({
        conversationId,
        deletedFor: { $ne: req.user._id },
        deletedAt: null
    })
    .populate('senderId', 'username avatar')
    .populate('replyTo')
    .sort({ createdAt: -1 }) // latest pehle
    .skip(skip)
    .limit(limit);

    const total = await Message.countDocuments({
        conversationId,
        deletedFor: { $ne: req.user._id },
        deletedAt: null
    });

    res.json({
        success: true,
        messages: messages.reverse(), // purane pehle dikhao
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasMore: page < Math.ceil(total / limit)
        }
    });
});

// @route  DELETE /api/messages/:id
// @desc   Message delete karo
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { deleteFor } = req.query;

    const message = await Message.findById(req.params.id);

    if (!message) throw new ApiError(404, 'Message not found');

    if (deleteFor === 'everyone') {
        // Sabke liye delete — sirf sender
        if (message.senderId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'You can only delete your own messages for everyone');
        }
        message.deletedAt = new Date();
        message.content = 'This message was deleted';
        await message.save();
    } else {
        // Sirf apne liye delete — check conversation membership
        const conversation = await Conversation.findOne({
            _id: message.conversationId,
            members: req.user._id
        });

        if (!conversation) {
            throw new ApiError(404, 'Message not found');
        }

        if (!message.deletedFor) {
            message.deletedFor = [];
        }
        const alreadyDeleted = message.deletedFor.some(id => id.toString() === req.user?._id.toString());
        if (!alreadyDeleted) {
            message.deletedFor.push(req.user._id);
            await message.save();
        }
    }

    res.json({ success: true, message: 'Message deleted' });
});

// @route  PATCH /api/messages/:id/react
// @desc   Message pe reaction do
export const reactToMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { emoji } = req.body;

    const message = await Message.findById(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found');

    if (!message.reactions) {
        message.reactions = [];
    }

    // Pehle se react kiya hua hai?
    const existingIndex = message.reactions.findIndex(
        r => r.userId.toString() === req.user?._id.toString()
    );

    if (existingIndex > -1) {
        if (message.reactions[existingIndex].emoji === emoji) {
            // Same emoji — remove karo (toggle)
            message.reactions.splice(existingIndex, 1);
        } else {
            // Alag emoji — update karo
            message.reactions[existingIndex].emoji = emoji;
        }
    } else {
        // Naya reaction add karo
        message.reactions.push({ userId: req.user._id, emoji });
    }

    await message.save();

    res.json({ success: true, reactions: message.reactions });
});

// @route  PATCH /api/messages/:id/read
// @desc   Message read mark karo
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const message = await Message.findById(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found');

    if (!message.readBy) {
        message.readBy = [];
    }

    // Pehle se read kiya hua?
    const alreadyRead = message.readBy.some(
        r => r.userId.toString() === req.user?._id.toString()
    );

    if (!alreadyRead) {
        message.readBy.push({ userId: req.user._id, readAt: new Date() });
        await message.save();
    }

    res.json({ success: true, message: 'Marked as read' });
});
