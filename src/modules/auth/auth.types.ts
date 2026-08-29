import { Types } from 'mongoose';

export interface RegisterDto {
    username: string;
    email: string;
    password?: string;
}

export interface AuthUserResponse {
    _id: Types.ObjectId;
    username: string;
    email: string;
    avatar: string;
    bio?: string;
    status: string;
}

export interface AuthSuccessResult {
    success: true;
    token: string;
    user: AuthUserResponse;
}
