const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Memory storage — seedha Cloudinary pe jayega
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = [
        'image/jpeg', 'image/jpg', 'image/png',
        'image/gif', 'image/webp',
        'video/mp4', 'video/quicktime',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'File type not allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;