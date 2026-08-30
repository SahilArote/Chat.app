import { Request, Response } from 'express';
import { ErrorCode } from './errorCodes';

export interface ApiResponseMeta {
    requestId?: string;
    timestamp: string;
    [key: string]: any;
}

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    error: null;
    meta: ApiResponseMeta;
}

export interface ApiErrorDetail {
    code: ErrorCode | string;
    message: string;
    details?: any;
}

export interface ApiErrorResponse {
    success: false;
    data: null;
    error: ApiErrorDetail;
    meta: ApiResponseMeta;
}

export class ApiResponse {
    static getMeta(req?: Request, extraMeta: Record<string, any> = {}): ApiResponseMeta {
        return {
            requestId: req?.requestId || `req_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...extraMeta
        };
    }

    static success<T = any>(
        res: Response,
        data: T,
        statusCode: number = 200,
        extraMeta: Record<string, any> = {}
    ): Response {
        const meta = this.getMeta(res.req, extraMeta);
        const payload: ApiSuccessResponse<T> = {
            success: true,
            data,
            error: null,
            meta
        };
        return res.status(statusCode).json(payload);
    }

    static error(
        res: Response,
        code: ErrorCode | string,
        message: string,
        statusCode: number = 500,
        details?: any,
        extraMeta: Record<string, any> = {}
    ): Response {
        const meta = this.getMeta(res.req, extraMeta);
        const payload: ApiErrorResponse = {
            success: false,
            data: null,
            error: {
                code,
                message,
                ...(details ? { details } : {})
            },
            meta
        };
        return res.status(statusCode).json(payload);
    }
}

export default ApiResponse;
