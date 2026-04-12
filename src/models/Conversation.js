const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['dm', 'group'],
        required: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
        // sirf group ke liye use hoga
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // sirf group ke liye
    }],
    groupAvatar: {
        type: String,
        default: ''
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    // DM mein dono users ke liye delete track karna
    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Fast lookup — user ki saari conversations
conversationSchema.index({ members: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);