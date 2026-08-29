import { Server } from 'socket.io';
import { AuthenticatedSocket, TypingPayload } from '../socket.types';
import SocketEvents from '../socket.events';

export const registerTypingHandlers = (io: Server, socket: AuthenticatedSocket): void => {
    const userId = socket.userId;
    const username = socket.username;
    if (!userId || !username) return;

    socket.on(SocketEvents.TYPING, ({ conversationId }: TypingPayload) => {
        socket.to(conversationId).emit(SocketEvents.USER_TYPING, {
            userId,
            username,
            conversationId
        });
    });

    socket.on(SocketEvents.STOP_TYPING, ({ conversationId }: TypingPayload) => {
        socket.to(conversationId).emit(SocketEvents.USER_STOP_TYPING, {
            userId,
            conversationId
        });
    });
};

export default registerTypingHandlers;
