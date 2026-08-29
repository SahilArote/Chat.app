import { Request, Response } from 'express';
import conversationService from './conversation.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

export const createOrGetDM = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { userId } = req.body;
    const conversation = await conversationService.createOrGetDM(req.user._id, userId);
    res.status(200).json({ success: true, conversation });
});

export const getMyConversations = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversations = await conversationService.getMyConversations(req.user._id);
    res.json({ success: true, conversations });
});

export const createGroup = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { name, members } = req.body;
    const conversation = await conversationService.createGroup(req.user._id, name, members);
    res.status(201).json({ success: true, conversation });
});

export const getConversationById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const conversation = await conversationService.getConversationById(req.params.id as string, req.user._id);
    res.json({ success: true, conversation });
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { userId } = req.body;
    const conversation = await conversationService.addMember(req.params.id as string, req.user._id, userId);
    res.json({ success: true, conversation });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    const { userId } = req.body;
    const conversation = await conversationService.removeMember(req.params.id as string, req.user._id, userId);
    res.json({ success: true, conversation });
});

export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, 'Not authenticated');
    await conversationService.deleteConversation(req.params.id as string, req.user._id);
    res.json({ success: true, message: 'Conversation deleted' });
});
