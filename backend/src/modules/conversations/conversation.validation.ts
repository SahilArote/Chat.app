import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createDMSchema = {
    body: z.object({
        userId: z.string().regex(objectIdRegex, 'Invalid target User ID')
    })
};

export const createGroupSchema = {
    body: z.object({
        name: z.string().trim().min(1, 'Group name is required').max(100, 'Group name cannot exceed 100 characters'),
        members: z.array(z.string().regex(objectIdRegex, 'Invalid member User ID')).min(2, 'Group must have at least 2 members')
    })
};

export const getConversationByIdSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    })
};

export const addMemberSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    }),
    body: z.object({
        userId: z.string().regex(objectIdRegex, 'Invalid member User ID')
    })
};

export const removeMemberSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    }),
    body: z.object({
        userId: z.string().regex(objectIdRegex, 'Invalid member User ID')
    })
};

export const deleteConversationSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    })
};
