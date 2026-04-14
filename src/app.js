const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const path = require('path');

const connectDB = require('./config/db');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const { initSocket } = require('./socket');

const app = express();
const httpServer = createServer(app);

// DB connect
connectDB();

// Models register
require('./models/User');
require('./models/Message');
require('./models/Conversation');
require('./models/Notification');

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(helmet());
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
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chat API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/conversations', require('./routes/conversation'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/upload', require('./routes/upload'));
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Server start
httpServer.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});
// src/app.js mein add karo — server khud ko ping karta rahega
if (config.nodeEnv === 'production') {
    setInterval(async () => {
        try {
            const https = require('https');
            https.get(process.env.RENDER_URL || 'https://chat-app-r36i.onrender.com/health');
        } catch {}
    }, 14 * 60 * 1000); // har 14 min mein ping
}

module.exports = { app, httpServer };