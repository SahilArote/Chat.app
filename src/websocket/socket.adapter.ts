import { Server } from 'socket.io';

export const configureSocketAdapter = async (io: Server): Promise<void> => {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
        try {
            console.log(`[Socket Adapter] Initializing Redis adapter on ${redisUrl}...`);
            // Dynamic import / adapter configuration when Redis is provided
        } catch (err: any) {
            console.error('[Socket Adapter] Failed to initialize Redis adapter, falling back to in-memory:', err.message);
        }
    } else {
        // In-memory default for single-node / local development
    }
};

export default configureSocketAdapter;
