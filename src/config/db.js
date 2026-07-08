const mongoose = require('mongoose');
const dns = require('dns');
const config = require('./index');

// Fix querySrv ECONNREFUSED DNS resolution bug for MongoDB SRV records in newer Node.js versions
try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (err) {
    console.warn('Failed to set public DNS servers:', err.message);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`DB Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;