import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import config from '../config';
import { ErrorCode } from '../utils/errorCodes';
import ApiResponse from '../utils/apiResponse';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let code: ErrorCode | string = err.code || ErrorCode.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong';

    // Server-side logging for diagnostics
    console.error(`[Error Handler] [${req.requestId || 'no-id'}] Status ${statusCode} (${code}): ${message}\n`, err.stack || '');

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Resource not found';
        code = ErrorCode.NOT_FOUND;
        statusCode = 404;
    }

    // Duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'Field';
        message = `${field} already exists`;
        code = field === 'email' ? ErrorCode.EMAIL_ALREADY_REGISTERED : ErrorCode.USER_ALREADY_EXISTS;
        statusCode = 400;
    }

    // Mongoose validation
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors || {}).map((e: any) => e.message).join(', ');
        code = ErrorCode.VALIDATION_ERROR;
        statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        code = ErrorCode.UNAUTHORIZED;
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expired, please login again';
        code = ErrorCode.UNAUTHORIZED;
        statusCode = 401;
    }

    return ApiResponse.error(
        res,
        code,
        message,
        statusCode,
        config.nodeEnv === 'development' ? { stack: err.stack } : undefined
    );
};

export default errorHandler;
