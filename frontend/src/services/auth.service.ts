import { z } from 'zod';
import { API_ENDPOINTS } from '../config/api';

// Interfaces based on Backend Types
export interface User {
    id: string;
    email: string;
    name: string;
    university?: string | null;
    baseCurrency: string;
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Zod Schemas for Validation (Client-Side)
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    university: z.string().max(150).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const authService = {
    async register(data: RegisterInput): Promise<AuthResponse> {
        const response = await fetch(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const json = await response.json();
        return json.data;
    },

    async login(data: LoginInput): Promise<AuthResponse> {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const json = await response.json();
        return json.data;
    },

    logout() {
        // Client-side logout only for now (clear tokens)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
};
