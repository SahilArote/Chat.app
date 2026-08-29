import { Server } from 'socket.io';
import { Types } from 'mongoose';
import {
    AuthenticatedSocket,
    SendMessagePayload,
    MarkReadPayload,
    ReactionPayload,
    MessageDeletedPayload,
    SocketAckResponse
} from '../socket.types';
import SocketEvents from '../socket.events';
import Message from '../../modules/messages/message.model';
import Conversation from '../../modules/conversations/conversation.model';

export const registerChatHandlers = (io: Server, socket: AuthenticatedSocket): void => {
    const userId = socket.userId;
    const username = socket.username;
    if (!userId) return;

    // ─── SEND MESSAGE ─────────────────────────────────────────
    socket.on(SocketEvents.SEND_MESSAGE, async (data: SendMessagePayload, ack?: (res: SocketAckResponse) => void) => {
        try {
            const { conversationId, content, type = 'text', replyTo } = data;

            const conversation = await Conversation.findOne({
                _id: conversationId,
                members: userId
            }).select('_id');

            if (!conversation) {
                const err = { message: 'Conversation not found or not a member' };
                socket.emit(SocketEvents.ERROR, err);
                if (ack) ack({ success: false, error: err.message });
                return;
            }

            const message = await Message.create({
                conversationId: new Types.ObjectId(conversationId),
                senderId: new Types.ObjectId(userId),
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

            io.to(conversationId).emit(SocketEvents.MESSAGE_RECEIVED, {
                message: populated,
                conversationId
            });

            if (ack) ack({ success: true, data: populated });

        } catch (err: any) {
            socket.emit(SocketEvents.ERROR, { message: err.message });
            if (ack) ack({ success: false, error: err.message });
        }
    });

    // ─── MARK AS READ ─────────────────────────────────────────
    socket.on(SocketEvents.MARK_READ, async ({ messageId, conversationId }: MarkReadPayload) => {
        try {
            const message = await Message.findById(messageId);
            if (!message) return;

            if (!message.readBy) {
                message.readBy = [];
            }

            const alreadyRead = message.readBy.some(
                r => r.userId.toString() === userId
            );

            if (!alreadyRead) {
                message.readBy.push({
                    userId: new Types.ObjectId(userId),
                    readAt: new Date()
                });
                await message.save();
            }

            socket.to(conversationId).emit(SocketEvents.MESSAGE_READ, {
                messageId,
                userId,
                username
            });

        } catch (err: any) {
            socket.emit(SocketEvents.ERROR, { message: err.message });
        }
    });

    // ─── REACTION SYNC ────────────────────────────────────────
    socket.on(SocketEvents.MESSAGE_REACTED, ({ messageId, reactions, conversationId }: ReactionPayload) => {
        socket.to(conversationId).emit(SocketEvents.REACTION_UPDATED, {
            messageId,
            reactions
        });
    });

    // ─── DELETE SYNC ──────────────────────────────────────────
    socket.on(SocketEvents.MESSAGE_DELETED, ({ messageId, conversationId, content }: MessageDeletedPayload) => {
        socket.to(conversationId).emit(SocketEvents.MESSAGE_DELETED_SYNC, {
            messageId,
            content
        });
    });
};

export default registerChatHandlers;
