import prisma from '../config/database';
import { hashPassword, comparePassword, generateTokenPair } from '../utils';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils';
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
    throw new ConflictError('User with this email already exists');
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
    ...tokens,
  };
};

/**
 * Login user
 */
export const loginUser = async (input: LoginInput) => {
  // Find user
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
    },
  });

  if (!user || user.deletedAt) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  // Remove passwordHash from response
  const { passwordHash, deletedAt, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    ...tokens,
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
