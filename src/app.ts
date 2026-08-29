import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import path from 'path';
import https from 'https';

import connectDB from './config/db';
import config from './config';
import errorHandler from './middlewares/errorHandler';
import { initSocket } from './socket';

// Register models
import './models/User';
import './models/Message';
import './models/Conversation';
import './models/Notification';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import conversationRoutes from './routes/conversation';
import messageRoutes from './routes/message';
import uploadRoutes from './routes/upload';

const app = express();
const httpServer = createServer(app);

// DB connect
connectDB();

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts for legacy vanilla frontend
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Socket initialize
const io = initSocket(httpServer);
app.set('io', io);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Chat API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
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
