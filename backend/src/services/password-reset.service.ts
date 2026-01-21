import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.service';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { BadRequestError } from '../utils/errors';
import type {
  RequestPasswordResetInput,
  ResetPasswordInput,
  VerifyResetTokenInput,
} from '../types/password-reset.types';

/**
 * Generate a secure random token
 */
const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash the reset token for storage
 * (Don't store plain tokens in database)
 */
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Request password reset
 * Generates token and sends email (or returns token for testing)
 */
export const requestPasswordReset = async (input: RequestPasswordResetInput) => {
  const { email } = input;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // IMPORTANT: Always return success even if user doesn't exist
  // This prevents email enumeration attacks
  if (!user) {
    // Still return success to prevent user enumeration
    return {
      message: 'If an account exists with that email, a password reset link has been sent.',
      // In production, this would be hidden
      debug: process.env.NODE_ENV === 'development' ? 'User not found' : undefined,
    };
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const hashedToken = hashToken(resetToken);

  // Set expiration (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Delete any existing reset tokens for this user
  await prisma.passwordReset.deleteMany({
    where: { userId: user.id },
  });

  // Store hashed token in database
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  // Send email with reset link
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  // In production, send email here
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_EMAIL === 'true') {
    await sendPasswordResetEmail(user.email, resetUrl);
    console.log('📧 Password reset email sent to:', user.email);
  }

  return {
    message: 'If an account exists with that email, a password reset link has been sent.',
    // Only include these in development
    ...(process.env.NODE_ENV === 'development' && {
      debug: {
        resetToken,
        resetUrl,
        expiresAt,
        userId: user.id,
      },
    }),
  };
};

/**
 * Verify reset token is valid
 */
export const verifyResetToken = async (input: VerifyResetTokenInput) => {
  const { token } = input;

  // Hash the provided token
  const hashedToken = hashToken(token);

  // Find reset record
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  // Check if token exists
  if (!resetRecord) {
    throw new BadRequestError('Invalid or expired reset token');
  }

  // Check if token is expired
  if (new Date() > resetRecord.expiresAt) {
    // Delete expired token
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });
    throw new BadRequestError('Reset token has expired');
  }

  // Token is valid
  return {
    valid: true,
    userId: resetRecord.userId,
    email: resetRecord.user.email,
    expiresAt: resetRecord.expiresAt,
  };
};

/**
 * Reset password using token
 */
export const resetPassword = async (input: ResetPasswordInput) => {
  const { token, newPassword } = input;

  // Hash the provided token
  const hashedToken = hashToken(token);

  // Find reset record
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  // Check if token exists
  if (!resetRecord) {
    throw new BadRequestError('Invalid or expired reset token');
  }

  // Check if token is expired
  if (new Date() > resetRecord.expiresAt) {
    // Delete expired token
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });
    throw new BadRequestError('Reset token has expired');
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update user password
  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { passwordHash },
  });

  // Delete the reset token (one-time use)
  await prisma.passwordReset.delete({
    where: { id: resetRecord.id },
  });

  // Optionally: Invalidate all existing sessions/tokens for this user
  // This forces user to login again with new password
  await prisma.refreshToken.deleteMany({
    where: { userId: resetRecord.userId },
  });

  return {
    message: 'Password has been reset successfully',
    email: resetRecord.user.email,
  };
};

/**
 * Clean up expired reset tokens
 * (Run this periodically via cron job)
 */
export const cleanupExpiredTokens = async () => {
  const result = await prisma.passwordReset.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return {
    deletedCount: result.count,
  };
};

/**
 * Get all active reset tokens for a user
 * (Useful for debugging/admin)
 */
export const getUserResetTokens = async (userId: string) => {
  const tokens = await prisma.passwordReset.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return tokens;
};
