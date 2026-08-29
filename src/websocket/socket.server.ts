import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUserDocument } from '../modules/users/user.model';
import Message from '../modules/messages/message.model';
import Conversation from '../modules/conversations/conversation.model';
import config from '../config';

export interface AuthenticatedSocket extends Socket {
    user?: IUserDocument;
}

interface DecodedToken extends JwtPayload {
    userId: string;
}

export const onlineUsers = new Map<string, Set<string>>();

export const initSocket = (httpServer: HttpServer): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // ─── AUTH MIDDLEWARE ─────────────────────────────────
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();

        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    // ─── CONNECTION ──────────────────────────────────────
    io.on('connection', async (socket: AuthenticatedSocket) => {
        if (!socket.user) return;
        const userId = socket.user._id.toString();
        const username = socket.user.username;
        console.log(`User connected: ${username} (${socket.id})`);

        const isAlreadyOnline = onlineUsers.has(userId);

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId)!.add(socket.id);

        if (!isAlreadyOnline) {
            await User.findByIdAndUpdate(userId, {
                status: 'online',
                lastSeen: new Date()
            });

            socket.broadcast.emit('user_online', {
                userId,
                username
            });
        }

        // ─── JOIN CONVERSATION ───────────────────────────
        socket.on('join_conversation', async (conversationId: string) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    members: userId
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                socket.join(conversationId);
                console.log(`${username} joined room: ${conversationId}`);

                socket.emit('joined_conversation', { conversationId });

            } catch (err: any) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── SEND MESSAGE ────────────────────────────────
        socket.on('send_message', async (data: any) => {
            try {
                const { conversationId, content, type = 'text', replyTo } = data;

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    members: userId
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                const message = await Message.create({
                    conversationId,
                    senderId: userId,
                    type,
                    content: content || '',
                    replyTo: replyTo || null
                });

                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: message._id,
                    updatedAt: new Date()
                });

                const populated = await Message.findById(message._id)
                    .populate('senderId', 'username avatar')
                    .populate('replyTo');

                io.to(conversationId).emit('message_received', {
                    message: populated,
                    conversationId
                });

            } catch (err: any) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── TYPING ──────────────────────────────────────
        socket.on('typing', ({ conversationId }: { conversationId: string }) => {
            socket.to(conversationId).emit('user_typing', {
                userId,
                username,
                conversationId
            });
        });

        socket.on('stop_typing', ({ conversationId }: { conversationId: string }) => {
            socket.to(conversationId).emit('user_stop_typing', {
                userId,
                conversationId
            });
        });

        // ─── MARK READ ───────────────────────────────────
        socket.on('mark_read', async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
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
                    message.readBy.push({ userId: socket.user!._id, readAt: new Date() });
                    await message.save();
                }

                socket.to(conversationId).emit('message_read', {
                    messageId,
                    userId,
                    username
                });

            } catch (err: any) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── REACTION SYNC ───────────────────────────────
        socket.on('message_reacted', ({ messageId, reactions, conversationId }: { messageId: string; reactions: any[]; conversationId: string }) => {
            socket.to(conversationId).emit('reaction_updated', { messageId, reactions });
        });

        // ─── DELETE SYNC ─────────────────────────────────
        socket.on('message_deleted', ({ messageId, conversationId, content }: { messageId: string; conversationId: string; content?: string }) => {
            socket.to(conversationId).emit('message_deleted_sync', { messageId, content });
        });

        // ─── DISCONNECT ──────────────────────────────────
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${username}`);

            const socketIds = onlineUsers.get(userId);
            if (socketIds) {
                socketIds.delete(socket.id);
                if (socketIds.size === 0) {
                    onlineUsers.delete(userId);

                    await User.findByIdAndUpdate(userId, {
                        status: 'offline',
                        lastSeen: new Date()
                    });

                    socket.broadcast.emit('user_offline', {
                        userId,
                        username,
                        lastSeen: new Date()
                    });
                }
            }
        });
    });

    return io;
};

export default initSocket;
