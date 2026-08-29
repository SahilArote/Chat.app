import express from 'express';
import upload from '../middlewares/upload';
import { protect } from '../middlewares/auth';
import {
    uploadImage,
    uploadVideo,
    uploadFile,
    uploadAvatar
} from '../controllers/uploadController';

const router = express.Router();

router.use(protect);

router.post('/image', upload.single('file'), uploadImage);
router.post('/video', upload.single('file'), uploadVideo);
router.post('/file', upload.single('file'), uploadFile);
router.post('/avatar', upload.single('file'), uploadAvatar);

export default router;
