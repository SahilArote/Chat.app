import { Request, Response } from 'express';
import userService from './user.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const query = req.query.q as string | undefined;
    const users = await userService.searchUsers(req.user._id, query);
    res.json({ success: true, users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    res.json({ success: true, user });
});
