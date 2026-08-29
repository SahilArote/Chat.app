import { z } from 'zod';

export const registerSchema = {
    body: z.object({
        username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30, 'Username cannot exceed 30 characters'),
        email: z.string().trim().email('Please provide a valid email').toLowerCase(),
        password: z.string().min(6, 'Password must be at least 6 characters')
    })
};

export const verifyOTPSchema = {
    body: z.object({
        email: z.string().trim().email('Please provide a valid email').toLowerCase(),
        otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit numeric code')
    })
};

export const resendOTPSchema = {
    body: z.object({
        email: z.string().trim().email('Please provide a valid email').toLowerCase()
    })
};

export const loginSchema = {
    body: z.object({
        email: z.string().trim().email('Please provide a valid email').toLowerCase(),
        password: z.string().min(1, 'Password is required')
    })
};
