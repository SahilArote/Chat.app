import { Types } from 'mongoose';
import User, { IUserDocument } from './user.model';
import ApiError from '../../utils/ApiError';

export class UserService {
    async searchUsers(currentUserId: Types.ObjectId | string, query?: string): Promise<IUserDocument[]> {
        if (!query || query.trim().length < 2) {
            return await User.find({
                _id: { $ne: currentUserId },
                isVerified: true
            }).select('username email avatar status lastSeen').limit(20);
        }

        return await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: currentUserId }
        }).select('username email avatar status lastSeen').limit(10);
    }

    async getUserById(userId: string): Promise<IUserDocument> {
        const user = await User.findById(userId).select('username email avatar bio status lastSeen');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return user;
    }

    async updateUserStatus(userId: Types.ObjectId | string, status: 'online' | 'offline', lastSeen: Date = new Date()): Promise<void> {
        await User.findByIdAndUpdate(userId, { status, lastSeen });
    }
}

export const userService = new UserService();
export default userService;
