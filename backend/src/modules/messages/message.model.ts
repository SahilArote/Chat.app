import mongoose, { Document, Schema, Types } from 'mongoose';
import { IReaction, IReadReceipt } from './message.types';

export interface IMessageDocument extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    type: 'text' | 'image' | 'video' | 'file';
    content: string;
    reactions: IReaction[];
    readBy: IReadReceipt[];
    replyTo?: Types.ObjectId | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
    deletedFor?: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const reactionSchema = new Schema<IReaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        emoji: { type: String, required: true }
    },
    { _id: false }
);

const readReceiptSchema = new Schema<IReadReceipt>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        readAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const messageSchema = new Schema<IMessageDocument>(
    {
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
        reactions: [reactionSchema],
        readBy: [readReceiptSchema],
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        deletedFor: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
);

// ─── COMPOUND & PERFORMANCE INDEXES ─────────────────────────────
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, isDeleted: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ replyTo: 1 });

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
export default Message;
