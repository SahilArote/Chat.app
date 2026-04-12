const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check karo user pehle se exist toh nahi karta
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(400,
            existingUser.email === email
                ? 'Email already registered'
                : 'Username already taken'
        );
    }

    // User banao — password model mein auto hash hoga
    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            status: user.status
        }
    });
});

// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Password bhi saath mein chahiye — select:false hai model mein
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Online status update karo
    await User.findByIdAndUpdate(user._id, {
        status: 'online',
        lastSeen: new Date()
    });

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
            status: user.status
        }
    });
});

// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        success: true,
        user
    });
});

// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
    // Offline status update karo
    await User.findByIdAndUpdate(req.user._id, {
        status: 'offline',
        lastSeen: new Date()
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = { register, login, getMe, logout };