import { Request, Response, NextFunction } from 'express';

function cleanInPlace(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
        for (const item of obj) {
            cleanInPlace(item);
        }
        return;
    }
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            cleanInPlace(obj[key]);
        }
    }
}

export const sanitize = (req: Request, res: Response, next: NextFunction): void => {
    if (req.body) cleanInPlace(req.body);
    if (req.query) cleanInPlace(req.query);
    if (req.params) cleanInPlace(req.params);
    next();
};

export default sanitize;
