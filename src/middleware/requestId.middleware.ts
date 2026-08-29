import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
    const incomingId = req.header('X-Request-Id');
    const id = incomingId || `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    req.requestId = id;
    req.startTime = Date.now();
    res.setHeader('X-Request-Id', id);

    next();
};

export default requestId;
