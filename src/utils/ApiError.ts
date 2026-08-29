import { ErrorCode } from './errorCodes';

export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code: ErrorCode;

    constructor(statusCode: number, message: string, code?: ErrorCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        if (code) {
            this.code = code;
        } else {
            // Infer default error code from HTTP status
            switch (statusCode) {
                case 400:
                    this.code = ErrorCode.BAD_REQUEST;
                    break;
                case 401:
                    this.code = ErrorCode.UNAUTHORIZED;
                    break;
                case 403:
                    this.code = ErrorCode.FORBIDDEN;
                    break;
                case 404:
                    this.code = ErrorCode.NOT_FOUND;
                    break;
                default:
                    this.code = ErrorCode.INTERNAL_SERVER_ERROR;
            }
        }

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default ApiError;
