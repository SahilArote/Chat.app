import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import uploadToCloudinary from '../utils/uploadToCloudinary';
import User from '../models/User';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/images',
        transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto' }
        ]
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: result.bytes,
        type: 'image'
    });
});

export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/videos',
        resource_type: 'video'
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: result.bytes,
        type: 'video'
    });
});

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/files',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: req.file.size,
        type: 'file'
    });
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/avatars',
        transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    });

    await User.findByIdAndUpdate(req.user._id, {
        avatar: result.secure_url
    });

    res.json({
        success: true,
        url: result.secure_url
    });
});
