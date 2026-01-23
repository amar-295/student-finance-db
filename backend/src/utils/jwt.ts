import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import jwtConfig from '../config/jwt';
import { UnauthorizedError } from './errors';

export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Generate access token with issuer and audience claims
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.expiresIn as any,
    algorithm: jwtConfig.algorithm,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };
  return jwt.sign(payload, jwtConfig.secret, options);
};

/**
 * Generate refresh token with issuer and audience claims
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.refreshExpiresIn as any,
    algorithm: jwtConfig.algorithm,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };
  return jwt.sign(payload, jwtConfig.refreshSecret, options);
};

/**
 * Verify access token with issuer and audience validation
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const options: VerifyOptions = {
      algorithms: [jwtConfig.algorithm],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    };
    return jwt.verify(token, jwtConfig.secret, options) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

/**
 * Verify refresh token with issuer and audience validation
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const options: VerifyOptions = {
      algorithms: [jwtConfig.algorithm],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    };
    return jwt.verify(token, jwtConfig.refreshSecret, options) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: JwtPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
