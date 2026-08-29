import request from 'supertest';
import { app } from '../src/app';

describe('GET /health', () => {
    it('should return 200 with standard API envelope and running status', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.status).toBe('OK');
        expect(res.body.data.message).toBe('Chat API is running');
        expect(res.body.error).toBeNull();
        expect(res.body.meta).toBeDefined();
        expect(res.body.meta.requestId).toBeDefined();
        expect(res.headers['x-request-id']).toBeDefined();
    });
});
