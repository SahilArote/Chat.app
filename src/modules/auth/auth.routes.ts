import express from 'express';
import {
    register, login, getMe, logout,
    verifyOTP, resendOTP
} from './auth.controller';
import { protect } from '../../middleware/auth.middleware';
import validate from '../../middleware/validate.middleware';
import { authLimiter } from '../../middleware/rateLimit.middleware';
import {
    registerSchema,
    verifyOTPSchema,
    resendOTPSchema,
    loginSchema
} from './auth.validation';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-otp', authLimiter, validate(verifyOTPSchema), verifyOTP);
router.post('/resend-otp', authLimiter, validate(resendOTPSchema), resendOTP);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
