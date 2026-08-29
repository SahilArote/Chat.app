import { Request, Response, NextFunction } from 'express';

// Validation stub to be replaced with Zod schemas in Phase 5
export const validate = (schema?: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        next();
    };
};
