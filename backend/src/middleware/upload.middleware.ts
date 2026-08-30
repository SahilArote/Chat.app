import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import ApiError from '../utils/ApiError';

// Memory storage — seedha Cloudinary pe jayega
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowed = [
        'image/jpeg', 'image/jpg', 'image/png',
        'image/gif', 'image/webp',
        'video/mp4', 'video/quicktime',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'File type not allowed') as any, false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload;
