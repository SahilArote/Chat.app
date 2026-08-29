import { Types } from 'mongoose';

export interface INotification {
    userId: Types.ObjectId;
    type: 'msg' | 'mention' | 'req';
    fromUserId: Types.ObjectId;
    conversationId?: Types.ObjectId | null;
    messageId?: Types.ObjectId | null;
    isRead: boolean;
    title?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
