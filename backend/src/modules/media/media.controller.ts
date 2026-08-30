import { Request, Response } from 'express';
import mediaService from './media.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/apiResponse';
import { ErrorCode } from '../../utils/errorCodes';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadImage(req.file);
    return ApiResponse.success(res, result);
});

export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadVideo(req.file);
    return ApiResponse.success(res, result);
});

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadFile(req.file);
    return ApiResponse.success(res, result);
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const result = await mediaService.uploadAvatar(req.user._id, req.file);
    return ApiResponse.success(res, result);
});
