const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/users/search?q=sahil
const searchUsers = asyncHandler(async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim().length < 2) {
        return res.json({ users: [] });
    }

    const users = await User.find({
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ],
        _id: { $ne: req.user._id } // apne aap ko exclude karo
    }).select('username email avatar status lastSeen').limit(10);

    res.json({ success: true, users });
});

// @route   GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('username email avatar bio status lastSeen');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.json({ success: true, user });
});

module.exports = { searchUsers, getUserById };