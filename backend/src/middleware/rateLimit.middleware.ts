import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import ApiResponse from '../utils/apiResponse';
import { ErrorCode } from '../utils/errorCodes';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Max 15 attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        return ApiResponse.error(
            res,
            ErrorCode.TOO_MANY_REQUESTS,
            'Too many attempts from this IP, please try again after 15 minutes',
            429
        );
    }
});

export const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // Max 60 messages per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        return ApiResponse.error(
            res,
            ErrorCode.TOO_MANY_REQUESTS,
            'Sending messages too quickly, please slow down',
            429
        );
    }
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Max 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        return ApiResponse.error(
            res,
            ErrorCode.TOO_MANY_REQUESTS,
            'Too many requests from this IP, please try again later',
            429
        );
    }
});
