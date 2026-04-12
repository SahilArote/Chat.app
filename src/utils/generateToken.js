const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

module.exports = generateToken;