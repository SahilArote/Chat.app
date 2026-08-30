import { Request, Response } from 'express';
import messageService from './message.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/apiResponse';
import { ErrorCode } from '../../utils/errorCodes';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const conversationId = req.params.conversationId as string;
    const { content, type = 'text', replyTo } = req.body;

    const message = await messageService.sendMessage(
        conversationId,
        req.user._id,
        content,
        type,
        replyTo
    );

    return ApiResponse.success(res, { message }, 201);
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const conversationId = req.params.conversationId as string;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const cursor = req.query.cursor as string | undefined;
    const before = req.query.before as string | undefined;
    const after = req.query.after as string | undefined;

    const result = await messageService.getMessages(
        conversationId,
        req.user._id,
        { page, limit, cursor, before, after }
    );

    return ApiResponse.success(res, {
        messages: result.items,
        pagination: result.pagination
    });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { deleteFor } = req.query;

    await messageService.deleteMessage(
        req.params.id as string,
        req.user._id,
        deleteFor as string
    );

    return ApiResponse.success(res, { message: 'Message deleted' });
});

export const reactToMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { emoji } = req.body;

    const reactions = await messageService.reactToMessage(
        req.params.id as string,
        req.user._id,
        emoji
    );

    return ApiResponse.success(res, { reactions });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);

    await messageService.markAsRead(
        req.params.id as string,
        req.user._id
    );

    return ApiResponse.success(res, { message: 'Marked as read' });
});
