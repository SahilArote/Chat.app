import request from 'supertest';
import { app } from '../src/app';

describe('API Envelope & Route Behavior', () => {
    it('should return 404 with standard error envelope for nonexistent routes', async () => {
        const res = await request(app).get('/api/v1/nonexistent-route');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.data).toBeNull();
        expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
        expect(res.body.error.message).toBe('Route /api/v1/nonexistent-route not found');
        expect(res.body.meta.requestId).toBeDefined();
        expect(res.body.meta.timestamp).toBeDefined();
    });

    it('should maintain backward compatibility on legacy /api/auth/me path', async () => {
        const res = await request(app).get('/api/auth/me');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
});
