import mongoose from 'mongoose';
import dns from 'dns';
import config from '../../config';

export const connectDB = async (): Promise<void> => {
    try {
        try {
            if (dns.setDefaultResultOrder) {
                dns.setDefaultResultOrder('ipv4first');
            }
            dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
        } catch (dnsErr: any) {
            console.warn('DNS server override warning:', dnsErr.message);
        }

        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err: any) {
        console.error(`DB Error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
