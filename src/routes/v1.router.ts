import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import conversationRoutes from '../modules/conversations/conversation.routes';
import messageRoutes from '../modules/messages/message.routes';
import mediaRoutes from '../modules/media/media.routes';

const v1Router = Router();

// Domain Route Mounting for API v1
v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/conversations', conversationRoutes);
v1Router.use('/messages', messageRoutes);
v1Router.use('/media', mediaRoutes);
v1Router.use('/upload', mediaRoutes); // Alias for media

export default v1Router;
