const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not logged in');
    }

    // Token verify karo
    const decoded = jwt.verify(token, config.jwt.secret);

    // User DB mein check karo
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new ApiError(401, 'User no longer exists');
    }

    // Password change check
    if (user.passwordChangedAfter(decoded.iat)) {
        throw new ApiError(401, 'Password changed, please login again');
    }

    req.user = user;
    next();
});

module.exports = { protect };