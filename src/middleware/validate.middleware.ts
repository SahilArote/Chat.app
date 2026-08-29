import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import ApiError from '../utils/ApiError';

export interface RequestValidationSchema {
    body?: ZodTypeAny;
    query?: ZodTypeAny;
    params?: ZodTypeAny;
}

export const validate = (schema: RequestValidationSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schema.params) {
                req.params = (await schema.params.parseAsync(req.params)) as any;
            }
            if (schema.query) {
                req.query = (await schema.query.parseAsync(req.query)) as any;
            }
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues
                    .map((err) => `${err.path.join('.') || 'field'}: ${err.message}`)
                    .join('; ');
                next(new ApiError(400, `Validation Error: ${formattedErrors}`));
            } else {
                next(error);
            }
        }
    };
};

export default validate;
