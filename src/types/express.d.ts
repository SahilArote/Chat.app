import { Request } from 'express';
import { IUserDocument } from '../modules/users/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
            requestId?: string;
            startTime?: number;
        }
    }
}
