/**
 * COMPLETE UPDATED: src/models/User.js
 * BUG 3 FIX: Pre-save hook fixed for async/await
 * Production ready
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: [200, 'Bio cannot exceed 200 characters']
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    fcmToken: {
        type: String,
        default: ''
    },
    passwordChangedAt: Date
}, { timestamps: true });

// ───────────────────────────────────────────────────────
// BUG 3 FIX: Removed next() call - not needed with async
// Modern Mongoose (v5.11.0+) doesn't require next() callback
// ───────────────────────────────────────────────────────
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// ─── METHODS ────────────────────────────────────────────
// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Password changed after token issued?
userSchema.methods.passwordChangedAfter = function(tokenIssuedAt) {
    if (this.passwordChangedAt) {
        return this.passwordChangedAt.getTime() / 1000 > tokenIssuedAt;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);
