import request from 'supertest';
import { app } from '../src/app';

describe('Auth Endpoints & Validation', () => {
    describe('POST /api/v1/auth/register validation', () => {
        it('should fail with 400 when body is empty or invalid', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.data).toBeNull();
            expect(res.body.error.code).toBe('BAD_REQUEST');
            expect(res.body.error.message).toContain('Validation Error');
        });

        it('should fail when password is less than 6 characters', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'validuser',
                    email: 'valid@example.com',
                    password: '123'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error.message).toContain('Password must be at least 6 characters');
        });
    });

    describe('GET /api/v1/auth/me unauthorized', () => {
        it('should return 401 UNAUTHORIZED when no token is provided', async () => {
            const res = await request(app).get('/api/v1/auth/me');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error.code).toBe('UNAUTHORIZED');
            expect(res.body.error.message).toBe('Not logged in');
        });
    });
});
