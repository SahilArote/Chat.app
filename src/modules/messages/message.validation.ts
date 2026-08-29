import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const sendMessageSchema = {
    params: z.object({
        conversationId: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    }),
    body: z.object({
        content: z.string().optional(),
        type: z.enum(['text', 'image', 'video', 'file']).optional(),
        replyTo: z.string().regex(objectIdRegex, 'Invalid replyTo Message ID').nullable().optional()
    })
};

export const getMessagesSchema = {
    params: z.object({
        conversationId: z.string().regex(objectIdRegex, 'Invalid Conversation ID')
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional()
    })
};

export const deleteMessageSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Message ID')
    }),
    query: z.object({
        deleteFor: z.enum(['me', 'everyone']).optional()
    })
};

export const reactToMessageSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Message ID')
    }),
    body: z.object({
        emoji: z.string().min(1, 'Emoji is required').max(10, 'Invalid emoji length')
    })
};

export const markAsReadSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid Message ID')
    })
};
