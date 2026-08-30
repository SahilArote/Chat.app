import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socket.types';
import socketAuthMiddleware from './socket.auth';
import configureSocketAdapter from './socket.adapter';
import registerPresenceHandlers, { onlineUsers } from './handlers/presence.handler';
import registerConversationHandlers from './handlers/conversation.handler';
import registerChatHandlers from './handlers/chat.handler';
import registerTypingHandlers from './handlers/typing.handler';

export { onlineUsers };

export const initSocket = (httpServer: HttpServer): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Configure horizontal scaling adapter (e.g. Redis)
    configureSocketAdapter(io);

    // Decoupled JWT Handshake Authentication Middleware
    io.use(socketAuthMiddleware);

    // Modular Connection Lifecycle
    io.on('connection', (socket: AuthenticatedSocket) => {
        if (!socket.userId || !socket.username) return;

        console.log(`[Socket] User connected: ${socket.username} (${socket.id})`);

        // Register domain event handlers
        registerPresenceHandlers(io, socket);
        registerConversationHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerTypingHandlers(io, socket);
    });

    return io;
};

export default initSocket;
