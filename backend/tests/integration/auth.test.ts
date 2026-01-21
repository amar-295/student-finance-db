import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
// import { prisma } from '../setup';

describe('Authentication API', () => {
    const testUser = {
        email: 'auto_test@example.com',
        password: 'SecurePass123!',
        name: 'Auto Test User',
        university: 'Test Uni'
    };

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(testUser.email);
        expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should prevent duplicate registration', async () => {
        // register once
        await request(app).post('/api/auth/register').send(testUser);

        // try again
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });
});
