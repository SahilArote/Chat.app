import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import config from '../../config';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

export const uploadToCloudinary = (fileBuffer: Buffer, options: UploadApiOptions = {}): Promise<UploadApiResponse> => {
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

export default cloudinary;
