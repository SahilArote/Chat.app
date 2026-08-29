import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { IConversation } from './conversation.types';

export interface IConversationDocument extends Document<Types.ObjectId>, IConversation {}

export type ConversationModel = Model<IConversationDocument>;

const conversationSchema = new Schema<IConversationDocument, ConversationModel>({
    type: {
        type: String,
        enum: ['dm', 'group'],
        required: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
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
    groupAvatar: {
        type: String,
        default: ''
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    deletedFor: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Fast lookup — user ki saari conversations
conversationSchema.index({ members: 1 });

export const Conversation = mongoose.model<IConversationDocument, ConversationModel>('Conversation', conversationSchema);
export default Conversation;
