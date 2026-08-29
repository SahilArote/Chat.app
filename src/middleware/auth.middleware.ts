import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../modules/users/user.model';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import config from '../config';

interface DecodedToken extends JwtPayload {
    userId: string;
    iat?: number;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not logged in');
    }

    // Token verify karo
    let decoded: DecodedToken;
    try {
        decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
    } catch (err) {
        throw new ApiError(401, 'Invalid token');
    }

    // User DB mein check karo
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new ApiError(401, 'User no longer exists');
    }

    // Password change check
    if (user.passwordChangedAfter(decoded.iat)) {
        throw new ApiError(401, 'Password changed, please login again');
    }

    req.user = user;
    next();
});
