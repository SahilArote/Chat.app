import { Types } from 'mongoose';
import Message, { IMessageDocument } from './message.model';
import { IReaction } from './message.types';
import Conversation from '../conversations/conversation.model';
import ApiError from '../../utils/ApiError';

export interface PaginatedMessages {
    messages: IMessageDocument[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasMore: boolean;
    };
}

export class MessageService {
    async sendMessage(
        conversationId: string,
        senderId: Types.ObjectId | string,
        content?: string,
        type: 'text' | 'image' | 'video' | 'file' = 'text',
        replyTo?: string | null
    ): Promise<IMessageDocument> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: senderId
        });

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found');
        }

        if (!content && type === 'text') {
            throw new ApiError(400, 'Message content is required');
        }

        const message: IMessageDocument = await Message.create({
            conversationId: new Types.ObjectId(conversationId),
            senderId: new Types.ObjectId(senderId.toString()),
            type,
            content: content || '',
            replyTo: replyTo ? new Types.ObjectId(replyTo) : null
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date()
        });

        const populated = await Message.findById(message._id)
            .populate('senderId', 'username avatar')
            .populate('replyTo');

        return populated!;
    }

    async getMessages(
        conversationId: string,
        userId: Types.ObjectId | string,
        page: number = 1,
        limit: number = 30
    ): Promise<PaginatedMessages> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: userId
        });

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found');
        }

        const skip = (page - 1) * limit;

        const messages = await Message.find({
            conversationId,
            deletedFor: { $ne: userId },
            deletedAt: null
        })
        .populate('senderId', 'username avatar')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Message.countDocuments({
            conversationId,
            deletedFor: { $ne: userId },
            deletedAt: null
        });

        return {
            messages: messages.reverse(),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasMore: page < Math.ceil(total / limit)
            }
        };
    }

    async deleteMessage(
        messageId: string,
        userId: Types.ObjectId | string,
        deleteFor?: string
    ): Promise<void> {
        const message = await Message.findById(messageId);
        if (!message) throw new ApiError(404, 'Message not found');

        if (deleteFor === 'everyone') {
            if (message.senderId.toString() !== userId.toString()) {
                throw new ApiError(403, 'You can only delete your own messages for everyone');
            }
            message.deletedAt = new Date();
            message.content = 'This message was deleted';
            await message.save();
        } else {
            const conversation = await Conversation.findOne({
                _id: message.conversationId,
                members: userId
            });

            if (!conversation) {
                throw new ApiError(404, 'Message not found');
            }

            if (!message.deletedFor) {
                message.deletedFor = [];
            }
            const alreadyDeleted = message.deletedFor.some(id => id.toString() === userId.toString());
            if (!alreadyDeleted) {
                message.deletedFor.push(new Types.ObjectId(userId.toString()));
                await message.save();
            }
        }
    }

    async reactToMessage(
        messageId: string,
        userId: Types.ObjectId | string,
        emoji: string
    ): Promise<IReaction[]> {
        const message = await Message.findById(messageId);
        if (!message) throw new ApiError(404, 'Message not found');

        if (!message.reactions) {
            message.reactions = [];
        }

        const existingIndex = message.reactions.findIndex(
            r => r.userId.toString() === userId.toString()
        );

        if (existingIndex > -1) {
            if (message.reactions[existingIndex].emoji === emoji) {
                message.reactions.splice(existingIndex, 1);
            } else {
                message.reactions[existingIndex].emoji = emoji;
            }
        } else {
            message.reactions.push({ userId: new Types.ObjectId(userId.toString()), emoji });
        }

        await message.save();
        return message.reactions;
    }

    async markAsRead(
        messageId: string,
        userId: Types.ObjectId | string
    ): Promise<void> {
        const message = await Message.findById(messageId);
        if (!message) throw new ApiError(404, 'Message not found');

        if (!message.readBy) {
            message.readBy = [];
        }

        const alreadyRead = message.readBy.some(
            r => r.userId.toString() === userId.toString()
        );

        if (!alreadyRead) {
            message.readBy.push({ userId: new Types.ObjectId(userId.toString()), readAt: new Date() });
            await message.save();
        }
    }
}

export const messageService = new MessageService();
export default messageService;
