import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../services/auth.service';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from '../types/auth.types';
import { verifyRefreshToken, generateAccessToken } from '../utils';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  // Validate input
  const input = registerSchema.parse(req.body);

  // Register user
  const result = await registerUser(input);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  // Validate input
  const input = loginSchema.parse(req.body);

  // Login user
  const result = await loginUser(input);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response) => {
  // Validate input
  const input = refreshTokenSchema.parse(req.body);

  // Verify refresh token
  const payload = verifyRefreshToken(input.refreshToken);

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken },
  });
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response) => {
  // User is attached to request by auth middleware
  const user = await getUserProfile(req.user!.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
};

/**
 * Update current user profile
 * PUT /api/auth/me
 */
export const updateMe = async (req: Request, res: Response) => {
  // Validate input
  const input = updateProfileSchema.parse(req.body);

  // Update profile
  const user = await updateUserProfile(req.user!.userId, input);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  // In a simple JWT implementation, logout is handled client-side
  // by removing the tokens. For added security, you could:
  // - Implement token blacklisting with Redis
  // - Track active sessions in database
  
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};
