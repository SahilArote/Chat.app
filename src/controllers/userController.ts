import { Request, Response } from 'express';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

// @route   GET /api/users/search?q=sahil
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const query = req.query.q as string | undefined;

    let users;
    if (!query || query.trim().length < 2) {
        // Return latest 20 verified users excluding self by default
        users = await User.find({
            _id: { $ne: req.user._id },
            isVerified: true
        }).select('username email avatar status lastSeen').limit(20);
    } else {
        users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user._id } // apne aap ko exclude karo
        }).select('username email avatar status lastSeen').limit(10);
    }

    res.json({ success: true, users });
});

// @route   GET /api/users/:id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
        .select('username email avatar bio status lastSeen');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.json({ success: true, user });
});
