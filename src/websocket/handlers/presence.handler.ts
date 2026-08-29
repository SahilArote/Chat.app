import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket.types';
import SocketEvents from '../socket.events';
import User from '../../modules/users/user.model';

export const onlineUsers = new Map<string, Set<string>>();

export const registerPresenceHandlers = (io: Server, socket: AuthenticatedSocket): void => {
    const userId = socket.userId;
    const username = socket.username;
    if (!userId || !username) return;

    const isAlreadyOnline = onlineUsers.has(userId);

    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    if (!isAlreadyOnline) {
        User.findByIdAndUpdate(userId, {
            status: 'online',
            lastSeen: new Date()
        }).exec();

        socket.broadcast.emit(SocketEvents.USER_ONLINE, {
            userId,
            username
        });
    }

    socket.on(SocketEvents.DISCONNECT, async () => {
        const socketIds = onlineUsers.get(userId);
        if (socketIds) {
            socketIds.delete(socket.id);
            if (socketIds.size === 0) {
                onlineUsers.delete(userId);

                const lastSeen = new Date();
                await User.findByIdAndUpdate(userId, {
                    status: 'offline',
                    lastSeen
                }).exec();

                socket.broadcast.emit(SocketEvents.USER_OFFLINE, {
                    userId,
                    username,
                    lastSeen
                });
            }
        }
    });
};

export default registerPresenceHandlers;
