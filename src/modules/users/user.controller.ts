import { Request, Response } from 'express';
import userService from './user.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/apiResponse';
import { ErrorCode } from '../../utils/errorCodes';

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const query = req.query.q as string | undefined;
    const users = await userService.searchUsers(req.user._id, query);
    return ApiResponse.success(res, { users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    return ApiResponse.success(res, { user });
});
