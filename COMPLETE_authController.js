/**
 * COMPLETE: src/controllers/authController.js
 * NOTE: Already correct! Uses findByIdAndUpdate() instead of save()
 * All user updates avoid triggering pre-save hook
 * Production ready
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendOTP } = require('../services/emailService');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ═════════════════════════════════════════════════════════
// REGISTER
// ═════════════════════════════════════════════════════════
exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        throw new ApiError(400,
            existing.email === email ? 'Email already registered' : 'Username already taken'
        );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
        username, 
        email, 
        password,
        isVerified: false,
        otp: { code: otp, expiresAt }
    });

    // Send OTP email
    await sendOTP(email, otp, username);

    // Return success with email (NOT token/user)
    res.status(201).json({
        success: true,
        message: 'OTP sent to your email',
        email
    });
});

// ═════════════════════════════════════════════════════════
// VERIFY OTP
// ═════════════════════════════════════════════════════════
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isVerified) throw new ApiError(400, 'Already verified');

    // Verify OTP
    if (!user.otp?.code || user.otp.code !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }

    // Check OTP expiry
    if (user.otp.expiresAt < new Date()) {
        throw new ApiError(400, 'OTP expired, please register again');
    }

    // ✅ Update user using findByIdAndUpdate (avoids pre-save hook)
    await User.findByIdAndUpdate(user._id, {
        isVerified: true,
        otp: null
    });

    // Generate token
    const token = generateToken(user._id);

    // Return token and user data
    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status
        }
    });
});

// ═════════════════════════════════════════════════════════
// RESEND OTP
// ═════════════════════════════════════════════════════════
exports.resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isVerified) throw new ApiError(400, 'Already verified');

    // Generate new OTP
    const otp = generateOTP();

    // ✅ Update user using findByIdAndUpdate (avoids pre-save hook)
    await User.findByIdAndUpdate(user._id, {
        otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    // Send OTP email
    await sendOTP(email, otp, user.username);

    res.json({ 
        success: true, 
        message: 'New OTP sent' 
    });
});

// ═════════════════════════════════════════════════════════
// LOGIN
// ═════════════════════════════════════════════════════════
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Check if email is verified
    if (!user.isVerified) {
        // Send OTP for verification
        const otp = generateOTP();

        // ✅ Update user using findByIdAndUpdate (avoids pre-save hook)
        await User.findByIdAndUpdate(user._id, {
            otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        });

        // Send OTP email
        await sendOTP(email, otp, user.username);

        // Return with needsVerification flag
        return res.status(403).json({
            success: false,
            needsVerification: true,
            email,
            message: 'Please verify your email first. OTP sent.'
        });
    }

    // Mark user as online
    // ✅ Update user using findByIdAndUpdate (avoids pre-save hook)
    await User.findByIdAndUpdate(user._id, {
        status: 'online',
        lastSeen: new Date()
    });

    // Generate token
    const token = generateToken(user._id);

    // Return token and user data
    res.json({
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
    });
});

// ═════════════════════════════════════════════════════════
// GET ME (Protected route)
// ═════════════════════════════════════════════════════════
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

// ═════════════════════════════════════════════════════════
// LOGOUT
// ═════════════════════════════════════════════════════════
exports.logout = asyncHandler(async (req, res) => {
    // ✅ Update user using findByIdAndUpdate (avoids pre-save hook)
    await User.findByIdAndUpdate(req.user._id, {
        status: 'offline',
        lastSeen: new Date()
    });

    res.json({ success: true, message: 'Logged out' });
});

// ═════════════════════════════════════════════════════════
// KEY NOTES:
// ═════════════════════════════════════════════════════════
// 1. All user updates use findByIdAndUpdate() NEVER .save()
// 2. This avoids triggering the pre-save password hashing hook
// 3. Password is only hashed on User.create() during registration
// 4. This approach is production-recommended for Mongoose v5.11.0+
// 5. No async/await compatibility issues with this pattern
