import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "../types/auth.types";
import {
  verifyRefreshToken,
  generateTokenPair,
  UnauthorizedError,
} from "../utils";
import {
  blacklistTokenPair,
  blacklistToken,
  isTokenBlacklisted,
} from "../services/tokenBlacklist.service";
import { logAuthEvent } from "../services/audit.service";

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
    message: "User registered successfully",
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

  // Log successful login
  logAuthEvent(
    result.user.id,
    "login",
    req.ip,
    req.headers["user-agent"] as string,
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
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

  // Check if refresh token is blacklisted (Reuse Detection)
  const isBlacklisted = await isTokenBlacklisted(input.refreshToken);
  if (isBlacklisted) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  // Verify refresh token
  const payload = verifyRefreshToken(input.refreshToken);

  // Generate new token pair (token rotation)
  const tokens = generateTokenPair({
    userId: payload.userId,
    email: payload.email,
  });

  // Blacklist the old refresh token (Token Invalidation)
  await blacklistToken(input.refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
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
  // Validate input
  const input = updateProfileSchema.parse(req.body);

  // Update profile
  const user = await updateUserProfile(req.user!.userId, input);

  // Log profile update
  logAuthEvent(
    req.user!.userId,
    "update_profile",
    req.ip,
    req.headers["user-agent"] as string,
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
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
    logAuthEvent(
      req.user.userId,
      "logout",
      req.ip,
      req.headers["user-agent"] as string,
    );
  }

  res.status(200).json({
    success: true,
    message: "Logout successful. Tokens have been invalidated.",
  });
};
