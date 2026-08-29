import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { IMessage, IReaction, IReadBy } from './message.types';

export interface IMessageDocument extends Document<Types.ObjectId>, IMessage {}

export type MessageModel = Model<IMessageDocument>;

const messageSchema = new Schema<IMessageDocument, MessageModel>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'file'],
        default: 'text'
    },
    content: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ''
    },
    fileSize: {
        type: Number,
        default: 0
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    reactions: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        emoji: String
    }],
    readBy: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    deletedFor: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Fast chat load — latest messages pehle
messageSchema.index({ conversationId: 1, createdAt: -1 });

// User message history
messageSchema.index({ senderId: 1 });

export const Message = mongoose.model<IMessageDocument, MessageModel>('Message', messageSchema);
export default Message;
