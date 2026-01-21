import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';
import { hashPassword } from '../../src/utils/password';

// Mock nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation(() => Promise.resolve({ messageId: 'test-message-id' })),
    }),
}));

describe('Password Reset Flow', () => {
    let userEmail = 'reset.test@example.com';
    let resetToken: string;

    beforeAll(async () => {
        // Cleanup
        await prisma.passwordReset.deleteMany();
        await prisma.user.deleteMany({ where: { email: userEmail } });

        // Create user
        const hashedPassword = await hashPassword('OldPassword123');
        await prisma.user.create({
            data: {
                email: userEmail,
                passwordHash: hashedPassword,
                name: 'Reset Test User',
            }
        });
    });

    afterAll(async () => {
        await prisma.passwordReset.deleteMany();
        await prisma.user.deleteMany({ where: { email: userEmail } });
        await prisma.$disconnect();
    });

    it('Step 1: Request Password Reset (Success)', async () => {
        // Mock environment to development to get the token back
        const oldEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: userEmail });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.debug).toBeDefined();
        resetToken = res.body.debug.resetToken;

        // Restore env
        process.env.NODE_ENV = oldEnv;
    });

    it('Step 2: Verify Reset Token (Valid)', async () => {
        const res = await request(app)
            .post('/api/auth/verify-reset-token')
            .send({ token: resetToken });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.valid).toBe(true);
        expect(res.body.data.email).toBe(userEmail);
    });

    it('Step 3: Reset Password (Success)', async () => {
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token: resetToken,
                newPassword: 'NewSecurePassword123'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('Step 4: Login with New Password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userEmail,
                password: 'NewSecurePassword123'
            });

        if (res.status !== 200) {
            console.log('Login failed (New Password):', JSON.stringify(res.body, null, 2));
        }
        expect(res.status).toBe(200);
        expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('Step 5: Old Password Should Fail', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userEmail,
                password: 'OldPassword123'
            });

        if (res.status !== 401 && res.status !== 400) {
            console.log('Login status (Old Password):', res.status, JSON.stringify(res.body, null, 2));
        }
        // The app might return 401 or 400 depending on error handler
        expect([400, 401]).toContain(res.status);
    });

    it('Step 6: Token Reuse Prevention', async () => {
        // Try to reuse the same token
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token: resetToken,
                newPassword: 'AnotherPassword123'
            });

        // Should fail as token is deleted/invalidated
        expect(res.status).toBe(400);
    });
});
