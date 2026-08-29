import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import path from 'path';
import https from 'https';

import config from './config';
import connectDB from './infrastructure/database/mongoose';
import errorHandler from './middleware/error.middleware';
import requestId from './middleware/requestId.middleware';
import sanitize from './middleware/sanitize.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { initSocket } from './websocket/socket.server';
import ApiResponse from './utils/apiResponse';
import { ErrorCode } from './utils/errorCodes';

// Register models
import './modules/users/user.model';
import './modules/messages/message.model';
import './modules/conversations/conversation.model';
import './modules/notifications/notification.model';

// Modular route imports
import v1Router from './routes/v1.router';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import conversationRoutes from './modules/conversations/conversation.routes';
import messageRoutes from './modules/messages/message.routes';
import mediaRoutes from './modules/media/media.routes';

const app = express();
const httpServer = createServer(app);

// DB connect
connectDB();

// Request ID tracking middleware
app.use(requestId);

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Security & Parsing Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts for legacy vanilla frontend
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);

if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Socket initialize
const io = initSocket(httpServer);
app.set('io', io);

// Health check
app.get('/health', (req: Request, res: Response) => {
    return ApiResponse.success(res, { status: 'OK', message: 'Chat API is running' });
});

// Primary API v1 Routes (Protected with global apiLimiter)
app.use('/api/v1', apiLimiter, v1Router);

// Legacy /api Routes (Backward Compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', mediaRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    return ApiResponse.error(res, ErrorCode.ROUTE_NOT_FOUND, `Route ${req.originalUrl} not found`, 404);
});

// Global error handler
app.use(errorHandler);

// Server start
const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => {
        console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });
}

// Self-ping interval for Render free tier sleep prevention
if (config.nodeEnv === 'production') {
    setInterval(() => {
        try {
            const renderUrl = process.env.RENDER_URL || 'https://chat-app-r36i.onrender.com/health';
            https.get(renderUrl);
        } catch {
            // Ignore keepalive errors
        }
    }, 14 * 60 * 1000);
}

export { app, httpServer };
