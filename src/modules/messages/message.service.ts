import { Types } from 'mongoose';
import Message from './message.model';
import { IReaction } from './message.types';
import Conversation from '../conversations/conversation.model';
import ApiError from '../../utils/ApiError';
import { ErrorCode } from '../../utils/errorCodes';
import { PaginationOptions, PaginationResult, PaginationHelper } from '../../utils/pagination';

export class MessageService {
    async sendMessage(
        conversationId: string,
        senderId: Types.ObjectId | string,
        content?: string,
        type: 'text' | 'image' | 'video' | 'file' = 'text',
        replyTo?: string | null
    ): Promise<any> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: senderId
        }).select('_id');

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found', ErrorCode.CONVERSATION_NOT_FOUND);
        }

        if (!content && type === 'text') {
            throw new ApiError(400, 'Message content is required', ErrorCode.BAD_REQUEST);
        }

        const message = await Message.create({
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
            .populate('replyTo')
            .lean();

        return populated;
    }

    async getMessages(
        conversationId: string,
        userId: Types.ObjectId | string,
        options: PaginationOptions = {}
    ): Promise<PaginationResult<any>> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: userId
        }).select('_id');

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found', ErrorCode.CONVERSATION_NOT_FOUND);
        }

        const limit = PaginationHelper.sanitizeLimit(options.limit, 30);
        const page = PaginationHelper.sanitizePage(options.page);

        const filter: any = {
            conversationId: new Types.ObjectId(conversationId),
            deletedFor: { $ne: new Types.ObjectId(userId.toString()) },
            deletedAt: null
        };

        // Cursor-based pagination support
        if (options.cursor || options.before) {
            const cursorId = options.cursor || options.before;
            filter._id = { $lt: new Types.ObjectId(cursorId) };
        } else if (options.after) {
            filter._id = { $gt: new Types.ObjectId(options.after) };
        }

        const skip = options.cursor || options.before || options.after ? 0 : (page - 1) * limit;

        const [messages, total] = await Promise.all([
            Message.find(filter)
                .select('_id conversationId senderId type content reactions readBy replyTo isDeleted deletedAt createdAt updatedAt')
                .populate('senderId', 'username avatar')
                .populate('replyTo')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit + 1)
                .lean(),
            Message.countDocuments({
                conversationId: new Types.ObjectId(conversationId),
                deletedFor: { $ne: new Types.ObjectId(userId.toString()) },
                deletedAt: null
            })
        ]);

        const hasMore = messages.length > limit;
        const resultMessages = hasMore ? messages.slice(0, limit) : messages;

        const nextCursor = resultMessages.length > 0 ? resultMessages[resultMessages.length - 1]._id.toString() : null;
        const prevCursor = resultMessages.length > 0 ? resultMessages[0]._id.toString() : null;

        return {
            items: resultMessages.reverse(),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasMore,
                nextCursor: hasMore ? nextCursor : null,
                prevCursor
            }
        };
    }

    async deleteMessage(
        messageId: string,
        userId: Types.ObjectId | string,
        deleteFor?: string
    ): Promise<void> {
        const message = await Message.findById(messageId);
        if (!message) throw new ApiError(404, 'Message not found', ErrorCode.MESSAGE_NOT_FOUND);

        if (deleteFor === 'everyone') {
            if (message.senderId.toString() !== userId.toString()) {
                throw new ApiError(403, 'You can only delete your own messages for everyone', ErrorCode.CANNOT_DELETE_MESSAGE);
            }
            message.isDeleted = true;
            message.deletedAt = new Date();
            message.content = 'This message was deleted';
            await message.save();
        } else {
            const conversation = await Conversation.findOne({
                _id: message.conversationId,
                members: userId
            }).select('_id');

            if (!conversation) {
                throw new ApiError(404, 'Message not found', ErrorCode.MESSAGE_NOT_FOUND);
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
        if (!message) throw new ApiError(404, 'Message not found', ErrorCode.MESSAGE_NOT_FOUND);

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
        if (!message) throw new ApiError(404, 'Message not found', ErrorCode.MESSAGE_NOT_FOUND);

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
