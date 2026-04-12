const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const config = require('../config');

// Online users track karne ke liye
// { userId: socketId }
const onlineUsers = new Map();

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // ─── AUTH MIDDLEWARE ─────────────────────────────────
    // Har socket connection pe pehle token verify karo
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, config.jwt.secret);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user; // user attach karo socket pe
            next();

        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    // ─── CONNECTION ──────────────────────────────────────
    io.on('connection', async (socket) => {
        const userId = socket.user._id.toString();
        console.log(`User connected: ${socket.user.username} (${socket.id})`);

        // Online users map mein add karo
        onlineUsers.set(userId, socket.id);

        // User ko online mark karo DB mein
        await User.findByIdAndUpdate(userId, {
            status: 'online',
            lastSeen: new Date()
        });

        // Saare users ko broadcast karo — yeh user online hua
        socket.broadcast.emit('user_online', {
            userId,
            username: socket.user.username
        });

        // ─── JOIN CONVERSATION ───────────────────────────
        // User apni conversations ke rooms mein join karo
        socket.on('join_conversation', async (conversationId) => {
            try {
                // Check karo user is conversation ka member hai
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    members: userId
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                socket.join(conversationId);
                console.log(`${socket.user.username} joined room: ${conversationId}`);

                socket.emit('joined_conversation', { conversationId });

            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── SEND MESSAGE ────────────────────────────────
        socket.on('send_message', async (data) => {
            try {
                const { conversationId, content, type = 'text', replyTo } = data;

                // Conversation check karo
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    members: userId
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Conversation not found' });
                    return;
                }

                // Message DB mein save karo
                const message = await Message.create({
                    conversationId,
                    senderId: userId,
                    type,
                    content: content || '',
                    replyTo: replyTo || null
                });

                // lastMessage update karo
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: message._id,
                    updatedAt: new Date()
                });

                // Populate karo
                const populated = await Message.findById(message._id)
                    .populate('senderId', 'username avatar')
                    .populate('replyTo');

                // Poore room ko message bhejo — sender bhi include
                io.to(conversationId).emit('message_received', {
                    message: populated,
                    conversationId
                });

            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── TYPING ──────────────────────────────────────
        socket.on('typing', ({ conversationId }) => {
            // Room mein baaki sabko batao — sender ko nahi
            socket.to(conversationId).emit('user_typing', {
                userId,
                username: socket.user.username,
                conversationId
            });
        });

        socket.on('stop_typing', ({ conversationId }) => {
            socket.to(conversationId).emit('user_stop_typing', {
                userId,
                conversationId
            });
        });

        // ─── MARK READ ───────────────────────────────────
        socket.on('mark_read', async ({ messageId, conversationId }) => {
            try {
                const message = await Message.findById(messageId);
                if (!message) return;

                const alreadyRead = message.readBy.some(
                    r => r.userId.toString() === userId
                );

                if (!alreadyRead) {
                    message.readBy.push({ userId });
                    await message.save();
                }

                // Room ko batao message read hua
                socket.to(conversationId).emit('message_read', {
                    messageId,
                    userId,
                    username: socket.user.username
                });

            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        // ─── DISCONNECT ──────────────────────────────────
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.user.username}`);

            onlineUsers.delete(userId);

            // Offline mark karo
            await User.findByIdAndUpdate(userId, {
                status: 'offline',
                lastSeen: new Date()
            });

            // Saare users ko batao
            socket.broadcast.emit('user_offline', {
                userId,
                username: socket.user.username,
                lastSeen: new Date()
            });
        });
    });

    return io;
};

module.exports = { initSocket, onlineUsers };