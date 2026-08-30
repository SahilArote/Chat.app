import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../infrastructure/storage/cloudinary';
import User from '../users/user.model';
import ApiError from '../../utils/ApiError';
import { UploadResult } from './media.types';

export class MediaService {
    async uploadImage(file?: Express.Multer.File): Promise<UploadResult> {
        if (!file) throw new ApiError(400, 'No file uploaded');

        const result = await uploadToCloudinary(file.buffer, {
            folder: 'chat-app/images',
            transformation: [
                { width: 1000, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        return {
            success: true,
            url: result.secure_url,
            fileName: file.originalname,
            size: result.bytes,
            type: 'image'
        };
    }

    async uploadVideo(file?: Express.Multer.File): Promise<UploadResult> {
        if (!file) throw new ApiError(400, 'No file uploaded');

        const result = await uploadToCloudinary(file.buffer, {
            folder: 'chat-app/videos',
            resource_type: 'video'
        });

        return {
            success: true,
            url: result.secure_url,
            fileName: file.originalname,
            size: result.bytes,
            type: 'video'
        };
    }

    async uploadFile(file?: Express.Multer.File): Promise<UploadResult> {
        if (!file) throw new ApiError(400, 'No file uploaded');

        const result = await uploadToCloudinary(file.buffer, {
            folder: 'chat-app/files',
            resource_type: 'raw',
            use_filename: true,
            unique_filename: true
        });

        return {
            success: true,
            url: result.secure_url,
            fileName: file.originalname,
            size: file.size,
            type: 'file'
        };
    }

    async uploadAvatar(userId: Types.ObjectId | string, file?: Express.Multer.File): Promise<{ success: boolean; url: string }> {
        if (!file) throw new ApiError(400, 'No file uploaded');

        const result = await uploadToCloudinary(file.buffer, {
            folder: 'chat-app/avatars',
            transformation: [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
            ]
        });

        await User.findByIdAndUpdate(userId, {
            avatar: result.secure_url
        });

        return {
            success: true,
            url: result.secure_url
        };
    }
}

export const mediaService = new MediaService();
export default mediaService;
