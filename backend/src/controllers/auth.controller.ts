import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../services/auth.service';
import { verifyRefreshToken, generateTokenPair, UnauthorizedError } from '../utils';
import { blacklistTokenPair, blacklistToken, isTokenBlacklisted } from '../services/tokenBlacklist.service';
import { logAuthEvent } from '../services/audit.service';
import { failedLoginTracker } from '../services/failedLoginTracker.service';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  // Register user
  const result = await registerUser(req.body);

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
  const identifier = req.ip || 'unknown';
  const email = req.body.email;

  try {
    // Login user
    const result = await loginUser(req.body);

    // Clear failed attempts on successful login
    await failedLoginTracker.clearFailedAttempts(identifier);
    if (email) {
      await failedLoginTracker.clearFailedAttempts(`${identifier}:${email}`);
    }

    // Log successful login
    logAuthEvent(result.user.id, 'login', req.ip, req.headers['user-agent'] as string);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    // Track failed login attempt
    await failedLoginTracker.recordFailedAttempt(identifier, email);

    // Re-throw the error to be handled by error handler
    throw error;
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  // Check if refresh token is blacklisted (Reuse Detection)
  const isBlacklisted = await isTokenBlacklisted(token);
  if (isBlacklisted) {
    throw new UnauthorizedError('Refresh token has been revoked');
  }

  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Generate new token pair (token rotation)
  const tokens = generateTokenPair({
    userId: payload.userId,
    email: payload.email,
  });

  // Blacklist the old refresh token (Token Invalidation)
  await blacklistToken(token);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: tokens,
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
  // Update profile
  const user = await updateUserProfile(req.user!.userId, req.body);

  // Log profile update
  logAuthEvent(req.user!.userId, 'update_profile', req.ip, req.headers['user-agent'] as string);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
};

/**
 * Logout user - blacklists the current token
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  // Get access token from request (attached by auth middleware)
  const accessToken = req.token;

  // Get refresh token from body if provided
  const refreshToken = req.body.refreshToken;

  // Blacklist both tokens
  if (accessToken) {
    await blacklistTokenPair(accessToken, refreshToken);
  }

  // Log logout
  if (req.user) {
    logAuthEvent(req.user.userId, 'logout', req.ip, req.headers['user-agent'] as string);
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful. Tokens have been invalidated.',
  });
};
