import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';

const uploadToCloudinary = (fileBuffer: Buffer, options: UploadApiOptions = {}): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadOptions: UploadApiOptions = {
            resource_type: 'auto',
            folder: 'chat-app',
            ...options
        };

        cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error || !result) reject(error || new Error('Cloudinary upload failed'));
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};

export default uploadToCloudinary;
