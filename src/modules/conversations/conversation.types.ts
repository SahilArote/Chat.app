import { Types } from 'mongoose';

export interface IConversation {
    type: 'dm' | 'group';
    name?: string;
    members: Types.ObjectId[];
    admins?: Types.ObjectId[];
    groupAvatar?: string;
    lastMessage?: Types.ObjectId | null;
    deletedFor?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
