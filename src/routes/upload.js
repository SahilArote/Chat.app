const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { protect } = require('../middlewares/auth');
const {
    uploadImage,
    uploadVideo,
    uploadFile,
    uploadAvatar
} = require('../controllers/uploadController');

router.use(protect);

router.post('/image', upload.single('file'), uploadImage);
router.post('/video', upload.single('file'), uploadVideo);
router.post('/file', upload.single('file'), uploadFile);
router.post('/avatar', upload.single('file'), uploadAvatar);

module.exports = router;