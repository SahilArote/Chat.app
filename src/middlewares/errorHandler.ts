import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import config from '../config';

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    // Log server-side errors for diagnostics
    console.error(`[Error Handler] Status ${statusCode}: ${err.message}\n`, err.stack || '');

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }

    // Duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'Field';
        message = `${field} already exists`;
        statusCode = 400;
    }

    // Mongoose validation
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors || {}).map((e: any) => e.message).join(', ');
        statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expired, please login again';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(config.nodeEnv === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
