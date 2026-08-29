import { Request, Response } from 'express';
import authService from './auth.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);
    res.json(result);
});

export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOTP(email);
    res.json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if ('needsVerification' in result) {
        res.status(403).json({
            success: false,
            needsVerification: true,
            email: result.email,
            message: result.message
        });
        return;
    }
    res.json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    res.json({ success: true, user: req.user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const result = await authService.logout(req.user._id);
    res.json(result);
});
