const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendOTP } = require('../services/emailService');

// OTP generate karo
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER — OTP bhejo, account create karo unverified
exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        throw new ApiError(400,
            existing.email === email ? 'Email already registered' : 'Username already taken'
        );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
        username, email, password,
        isVerified: false,
        otp: { code: otp, expiresAt }
    });

    // OTP email bhejo
    await sendOTP(email, otp, username);

    res.status(201).json({
        success: true,
        message: 'OTP sent to your email',
        email // frontend ko pata ho kahan bheja
    });
});

// VERIFY OTP
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');

    if (user.isVerified) throw new ApiError(400, 'Already verified');

    if (!user.otp?.code || user.otp.code !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }

    if (user.otp.expiresAt < new Date()) {
        throw new ApiError(400, 'OTP expired, please register again');
    }

    // Verify karo
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id);

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

// RESEND OTP
exports.resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isVerified) throw new ApiError(400, 'Already verified');

    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();

    await sendOTP(email, otp, user.username);

    res.json({ success: true, message: 'New OTP sent' });
});

// LOGIN — verified check karo
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
        // Naya OTP bhejo
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
        await user.save();
        await sendOTP(email, otp, user.username);

        return res.status(403).json({
            success: false,
            needsVerification: true,
            email,
            message: 'Please verify your email first. OTP sent.'
        });
    }

    await User.findByIdAndUpdate(user._id, { status: 'online', lastSeen: new Date() });

    const token = generateToken(user._id);

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

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

exports.logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { status: 'offline', lastSeen: new Date() });
    res.json({ success: true, message: 'Logged out successfully' });
});