import prisma from '../config/database';
import { hashPassword, comparePassword, generateTokenPair } from '../utils';
import { ConflictError, UnauthorizedError, NotFoundError, ForbiddenError } from '../utils';
import config from '../config/env';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../types/auth.types';

/**
 * Register a new user
 */
export const registerUser = async (input: RegisterInput) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      university: input.university,
      baseCurrency: input.baseCurrency || 'USD',
    },
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      baseCurrency: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  // Create default notification settings
  await prisma.notificationSettings.create({
    data: {
      userId: user.id,
    },
  });

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  return {
    user,
    tokens,
  };
};

/**
 * Login user with account lockout protection
 */
export const loginUser = async (input: LoginInput) => {
  // Find user including lockout fields
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      name: true,
      university: true,
      baseCurrency: true,
      emailVerified: true,
      deletedAt: true,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (user.lockedUntil.getTime() - Date.now()) / (1000 * 60)
    );
    throw new ForbiddenError(
      `Account is locked. Please try again in ${remainingMinutes} minute(s).`
    );
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    // Increment failed attempts
    const newFailedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newFailedAttempts >= config.lockout.threshold;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newFailedAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + config.lockout.durationMinutes * 60 * 1000)
          : null,
      },
    });

    if (shouldLock) {
      throw new ForbiddenError(
        `Too many failed attempts. Account locked for ${config.lockout.durationMinutes} minutes.`
      );
    }

    throw new UnauthorizedError('Invalid email or password');
  }

  // Reset failed attempts on successful login
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  // Remove sensitive fields from response
  const { passwordHash, deletedAt, failedLoginAttempts, lockedUntil, ...userWithoutSensitive } = user;

  return {
    user: userWithoutSensitive,
    tokens,
  };
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      baseCurrency: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      baseCurrency: true,
      emailVerified: true,
      updatedAt: true,
    },
  });

  return user;
};
