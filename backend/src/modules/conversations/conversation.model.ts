import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversationDocument extends Document {
    type: 'dm' | 'group';
    name?: string;
    members: Types.ObjectId[];
    admins?: Types.ObjectId[];
    lastMessage?: Types.ObjectId | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
    deletedFor?: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversationDocument>(
    {
        type: {
            type: String,
            enum: ['dm', 'group'],
            default: 'dm'
        },
        name: {
            type: String,
            trim: true,
            default: null
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        admins: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        lastMessage: {
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
conversationSchema.index({ members: 1, updatedAt: -1 });
conversationSchema.index({ type: 1, members: 1 });

export const Conversation = mongoose.model<IConversationDocument>('Conversation', conversationSchema);
export default Conversation;
