import mongoose, { Document, Model, Schema, Types } from 'mongoose';

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

export interface INotificationDocument extends Document<Types.ObjectId>, INotification {}

export type NotificationModel = Model<INotificationDocument>;

const notificationSchema = new Schema<INotificationDocument, NotificationModel>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['msg', 'mention', 'req'],
        required: true
    },
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        default: null
    },
    messageId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    title: String,
    body: String
}, { timestamps: true });

// Fast unread badge count
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model<INotificationDocument, NotificationModel>('Notification', notificationSchema);
export default Notification;
