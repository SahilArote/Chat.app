const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const User = require('../models/User');

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/images',
        transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto' }
        ]
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: result.bytes,
        type: 'image'
    });
});

const uploadVideo = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/videos',
        resource_type: 'video'
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: result.bytes,
        type: 'video'
    });
});

const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/files',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true
    });

    res.json({
        success: true,
        url: result.secure_url,
        fileName: req.file.originalname,
        size: req.file.size,
        type: 'file'
    });
});

const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'chat-app/avatars',
        transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    });

    await User.findByIdAndUpdate(req.user._id, {
        avatar: result.secure_url
    });

    res.json({
        success: true,
        url: result.secure_url
    });
});

module.exports = { uploadImage, uploadVideo, uploadFile, uploadAvatar };