const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
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
        // text messages ke liye
    },
    fileUrl: {
        type: String,
        default: ''
        // media/files ke liye cloudinary url
    },
    fileName: {
        type: String,
        default: ''
    },
    fileSize: {
        type: Number,
        default: 0
        // bytes mein
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        emoji: String
    }],
    readBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // sirf mere liye delete
    }],
    deletedAt: {
        type: Date,
        default: null
        // sabke liye delete — "delete for everyone"
    }
}, { timestamps: true });

// Fast chat load — latest messages pehle
messageSchema.index({ conversationId: 1, createdAt: -1 });

// User message history
messageSchema.index({ senderId: 1 });

module.exports = mongoose.model('Message', messageSchema);