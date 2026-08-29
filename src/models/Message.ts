import mongoose, { Document, Model, Schema, Types } from 'mongoose';

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

const Message = mongoose.model<IMessageDocument, MessageModel>('Message', messageSchema);
export default Message;
