import { Request, Response } from 'express';
import conversationService from './conversation.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/apiResponse';
import { ErrorCode } from '../../utils/errorCodes';

export const createOrGetDM = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { userId } = req.body;
    const conversation = await conversationService.createOrGetDM(req.user._id, userId);
    return ApiResponse.success(res, { conversation }, 200);
});

export const getMyConversations = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const conversations = await conversationService.getMyConversations(req.user._id);
    return ApiResponse.success(res, { conversations });
});

export const createGroup = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { name, members } = req.body;
    const conversation = await conversationService.createGroup(req.user._id, name, members);
    return ApiResponse.success(res, { conversation }, 201);
});

export const getConversationById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const conversation = await conversationService.getConversationById(req.params.id as string, req.user._id);
    return ApiResponse.success(res, { conversation });
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { userId } = req.body;
    const conversation = await conversationService.addMember(req.params.id as string, req.user._id, userId);
    return ApiResponse.success(res, { conversation });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    const { userId } = req.body;
    const conversation = await conversationService.removeMember(req.params.id as string, req.user._id, userId);
    return ApiResponse.success(res, { conversation });
});

export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated', ErrorCode.UNAUTHORIZED);
    await conversationService.deleteConversation(req.params.id as string, req.user._id);
    return ApiResponse.success(res, { message: 'Conversation deleted' });
});
