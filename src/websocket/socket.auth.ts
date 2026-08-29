import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../modules/users/user.model';
import config from '../config';
import { AuthenticatedSocket } from './socket.types';

interface DecodedToken extends JwtPayload {
    userId: string;
}

export const socketAuthMiddleware = async (
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
): Promise<void> => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

        if (!token) {
            return next(new Error('Authentication required'));
        }

        const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
        const user = await User.findById(decoded.userId).select('username avatar status lastSeen isVerified');

        if (!user) {
            return next(new Error('User not found'));
        }

        socket.user = user;
        socket.userId = user._id.toString();
        socket.username = user.username;
        next();
    } catch {
        next(new Error('Invalid or expired token'));
    }
};

export default socketAuthMiddleware;
