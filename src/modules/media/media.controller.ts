import { Request, Response } from 'express';
import mediaService from './media.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadImage(req.file);
    res.json(result);
});

export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadVideo(req.file);
    res.json(result);
});

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.uploadFile(req.file);
    res.json(result);
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const result = await mediaService.uploadAvatar(req.user._id, req.file);
    res.json(result);
});
