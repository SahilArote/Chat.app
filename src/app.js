const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');

const connectDB = require('./config/db');
const config = require('../config');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const httpServer = createServer(app); // socket.io ke liye http server chahiye

// DB connect
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Health check — deploy ke baad check karne ke liye
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chat API is running' });
});

// Routes — abhi placeholder, baad mein add karenge
app.use('/api/auth', require('./routes/auth'));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global error handler — sabse last mein
app.use(errorHandler);

// Server start
httpServer.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});


module.exports = { app, httpServer };