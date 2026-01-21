import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils';
import { UnauthorizedError } from '../utils';
import { isTokenBlacklisted } from '../services/tokenBlacklist.service';

/**
 * Authentication middleware - verifies JWT token and checks blacklist
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been revoked');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user and token to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    req.token = token;

    next();
  } catch (error) {
    next(error);
  };
};

/**
 * Optional Authentication middleware - populates req.user if token is present, 
 * but does not block the request if missing or invalid.
 * Useful for rate limiting by user ID where possible.
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      const isBlacklisted = await isTokenBlacklisted(token);
      if (!isBlacklisted) {
        const payload = verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
        req.token = token;
      }
    }
  } catch (error) {
    // Silently continue for optional auth
  } finally {
    next();
  }
};
