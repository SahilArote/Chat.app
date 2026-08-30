import { Types } from 'mongoose';

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
