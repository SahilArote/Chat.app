import { Socket } from 'socket.io';
import { IUserDocument } from '../modules/users/user.model';

export interface AuthenticatedSocket extends Socket {
    user?: IUserDocument;
    userId?: string;
    username?: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content?: string;
    type?: 'text' | 'image' | 'video' | 'file';
    replyTo?: string | null;
    fileName?: string;
    fileSize?: number;
}

export interface TypingPayload {
    conversationId: string;
}

export interface MarkReadPayload {
    messageId: string;
    conversationId: string;
}

export interface ReactionPayload {
    messageId: string;
    reactions: any[];
    conversationId: string;
}

export interface MessageDeletedPayload {
    messageId: string;
    conversationId: string;
    content?: string;
}

export interface SocketAckResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
