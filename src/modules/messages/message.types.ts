import { Types } from 'mongoose';

export interface IReaction {
    userId: Types.ObjectId;
    emoji: string;
}

export interface IReadBy {
    userId: Types.ObjectId;
    readAt: Date;
}

export interface IMessage {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    type: 'text' | 'image' | 'video' | 'file';
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyTo?: Types.ObjectId | null;
    reactions?: IReaction[];
    readBy?: IReadBy[];
    deletedFor?: Types.ObjectId[];
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
