import { Request, Response } from 'express';
import messageService from './message.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversationId = req.params.conversationId as string;
    const { content, type = 'text', replyTo } = req.body;

    const message = await messageService.sendMessage(
        conversationId,
        req.user._id,
        content,
        type,
        replyTo
    );

    res.status(201).json({ success: true, message });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversationId = req.params.conversationId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;

    const result = await messageService.getMessages(
        conversationId,
        req.user._id,
        page,
        limit
    );

    res.json({
        success: true,
        messages: result.messages,
        pagination: result.pagination
    });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { deleteFor } = req.query;

    await messageService.deleteMessage(
        req.params.id as string,
        req.user._id,
        deleteFor as string
    );

    res.json({ success: true, message: 'Message deleted' });
});

export const reactToMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { emoji } = req.body;

    const reactions = await messageService.reactToMessage(
        req.params.id as string,
        req.user._id,
        emoji
    );

    res.json({ success: true, reactions });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');

    await messageService.markAsRead(
        req.params.id as string,
        req.user._id
    );

    res.json({ success: true, message: 'Marked as read' });
});
