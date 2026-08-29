import express from 'express';
import { searchUsers, getUserById } from '../controllers/userController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserById);

export default router;
