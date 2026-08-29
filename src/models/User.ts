import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOtp {
    code?: string;
    expiresAt?: Date;
}

export interface IUser {
    username: string;
    email: string;
    password?: string;
    avatar: string;
    bio: string;
    status: 'online' | 'offline';
    lastSeen: Date;
    isVerified: boolean;
    otp?: IOtp | null;
    fcmToken: string;
    passwordChangedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    passwordChangedAfter(tokenIssuedAt?: number): boolean;
}

export interface IUserDocument extends Document<Types.ObjectId>, IUser, IUserMethods {}

export type UserModel = Model<IUserDocument, {}, IUserMethods>;

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>({
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

// Auto hash password before save
userSchema.pre('save', async function() {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Password changed after token issued?
userSchema.methods.passwordChangedAfter = function(tokenIssuedAt?: number): boolean {
    if (this.passwordChangedAt && tokenIssuedAt) {
        return this.passwordChangedAt.getTime() / 1000 > tokenIssuedAt;
    }
    return false;
};

const User = mongoose.model<IUserDocument, UserModel>('User', userSchema);
export default User;
