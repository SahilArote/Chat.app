import express from 'express';
import { searchUsers, getUserById } from './user.controller';
import { protect } from '../../middleware/auth.middleware';
import validate from '../../middleware/validate.middleware';
import { searchUsersSchema, getUserByIdSchema } from './user.validation';

const router = express.Router();

router.get('/search', protect, validate(searchUsersSchema), searchUsers);
router.get('/:id', protect, validate(getUserByIdSchema), getUserById);

export default router;
