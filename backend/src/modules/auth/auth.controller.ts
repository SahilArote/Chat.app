import { Request, Response } from 'express';
import authService from './auth.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/apiResponse';
import { ErrorCode } from '../../utils/errorCodes';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return ApiResponse.success(res, result, 201);
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);
    return ApiResponse.success(res, result);
});

export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOTP(email);
    return ApiResponse.success(res, result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if ('needsVerification' in result) {
        return ApiResponse.error(
            res,
            ErrorCode.EMAIL_NOT_VERIFIED,
            result.message,
            403,
            { email: result.email, needsVerification: true }
        );
    }
    return ApiResponse.success(res, result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    return ApiResponse.success(res, { user: req.user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const result = await authService.logout(req.user._id);
    return ApiResponse.success(res, result);
});
