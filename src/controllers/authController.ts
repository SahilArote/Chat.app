import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { sendOTP } from '../services/emailService';

const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        throw new ApiError(400,
            existing.email === email ? 'Email already registered' : 'Username already taken'
        );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
        username, email, password,
        isVerified: false,
        otp: { code: otp, expiresAt }
    });

    await sendOTP(email, otp, username);

    res.status(201).json({
        success: true,
        message: 'OTP sent to your email',
        email
    });
});

// VERIFY OTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isVerified) throw new ApiError(400, 'Already verified');

    if (!user.otp?.code || user.otp.code !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }

    if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
        throw new ApiError(400, 'OTP expired, please register again');
    }

    // findByIdAndUpdate — save() nahi
    await User.findByIdAndUpdate(user._id, {
        isVerified: true,
        otp: null
    });

    const token = generateToken(user._id);

    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status
        }
    });
});

// RESEND OTP
export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isVerified) throw new ApiError(400, 'Already verified');

    const otp = generateOTP();

    // findByIdAndUpdate — save() nahi
    await User.findByIdAndUpdate(user._id, {
        otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    await sendOTP(email, otp, user.username);

    res.json({ success: true, message: 'New OTP sent' });
});

// LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
        const otp = generateOTP();

        // findByIdAndUpdate — save() nahi
        await User.findByIdAndUpdate(user._id, {
            otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        });

        await sendOTP(email, otp, user.username);

        res.status(403).json({
            success: false,
            needsVerification: true,
            email,
            message: 'Please verify your email first. OTP sent.'
        });
        return;
    }

    // Online mark karo
    await User.findByIdAndUpdate(user._id, {
        status: 'online',
        lastSeen: new Date()
    });

    const token = generateToken(user._id);

    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            status: 'online'
        }
    });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    await User.findByIdAndUpdate(req.user._id, {
        status: 'offline',
        lastSeen: new Date()
    });
    res.json({ success: true, message: 'Logged out successfully' });
});
