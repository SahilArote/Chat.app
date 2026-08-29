import { Types } from 'mongoose';
import User from '../users/user.model';
import generateToken from '../../utils/generateToken';
import ApiError from '../../utils/ApiError';
import { sendOTPEmail } from '../../infrastructure/email/email.service';
import { AuthSuccessResult, RegisterDto } from './auth.types';

export class AuthService {
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async register(data: RegisterDto): Promise<{ success: boolean; message: string; email: string }> {
        const { username, email, password } = data;

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            throw new ApiError(400,
                existing.email === email ? 'Email already registered' : 'Username already taken'
            );
        }

        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await User.create({
            username, email, password,
            isVerified: false,
            otp: { code: otp, expiresAt }
        });

        await sendOTPEmail(email, otp, username);

        return {
            success: true,
            message: 'OTP sent to your email',
            email
        };
    }

    async verifyOTP(email: string, otp: string): Promise<AuthSuccessResult> {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(404, 'User not found');
        if (user.isVerified) throw new ApiError(400, 'Already verified');

        if (!user.otp?.code || user.otp.code !== otp) {
            throw new ApiError(400, 'Invalid OTP');
        }

        if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
            throw new ApiError(400, 'OTP expired, please register again');
        }

        await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            otp: null
        });

        const token = generateToken(user._id);

        return {
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                status: user.status
            }
        };
    }

    async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(404, 'User not found');
        if (user.isVerified) throw new ApiError(400, 'Already verified');

        const otp = this.generateOTP();

        await User.findByIdAndUpdate(user._id, {
            otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        });

        await sendOTPEmail(email, otp, user.username);

        return { success: true, message: 'New OTP sent' };
    }

    async login(email: string, password?: string): Promise<AuthSuccessResult | { needsVerification: true; email: string; message: string }> {
        if (!email || !password) {
            throw new ApiError(400, 'Please provide email and password');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            throw new ApiError(401, 'Invalid email or password');
        }

        if (!user.isVerified) {
            const otp = this.generateOTP();

            await User.findByIdAndUpdate(user._id, {
                otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
            });

            await sendOTPEmail(email, otp, user.username);

            return {
                needsVerification: true,
                email,
                message: 'Please verify your email first. OTP sent.'
            };
        }

        await User.findByIdAndUpdate(user._id, {
            status: 'online',
            lastSeen: new Date()
        });

        const token = generateToken(user._id);

        return {
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                status: 'online'
            }
        };
    }

    async logout(userId: Types.ObjectId | string): Promise<{ success: boolean; message: string }> {
        await User.findByIdAndUpdate(userId, {
            status: 'offline',
            lastSeen: new Date()
        });
        return { success: true, message: 'Logged out successfully' };
    }
}

export const authService = new AuthService();
export default authService;
