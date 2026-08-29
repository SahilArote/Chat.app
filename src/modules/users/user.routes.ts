import express from 'express';
import { searchUsers, getUserById } from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserById);

export default router;
