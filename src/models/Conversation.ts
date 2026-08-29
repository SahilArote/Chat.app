import mongoose, { Document, Model, Schema, Types } from 'mongoose';

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

const Conversation = mongoose.model<IConversationDocument, ConversationModel>('Conversation', conversationSchema);
export default Conversation;
