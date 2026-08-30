import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const searchUsersSchema = {
    query: z.object({
        q: z.string().optional()
    })
};

export const getUserByIdSchema = {
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid User ID format')
    })
};
