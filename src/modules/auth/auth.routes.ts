import express from 'express';
import {
    register, login, getMe, logout,
    verifyOTP, resendOTP
} from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
