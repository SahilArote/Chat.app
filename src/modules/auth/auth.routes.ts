import express from 'express';
import {
    register, login, getMe, logout,
    verifyOTP, resendOTP
} from './auth.controller';
import { protect } from '../../middleware/auth.middleware';
import validate from '../../middleware/validate.middleware';
import {
    registerSchema,
    verifyOTPSchema,
    resendOTPSchema,
    loginSchema
} from './auth.validation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/resend-otp', validate(resendOTPSchema), resendOTP);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
