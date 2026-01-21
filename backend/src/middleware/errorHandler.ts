import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError, ValidationError } from '../utils';
import config from '../config/env';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  if (config.env === 'development') {
    console.error('❌ Error:', err.message, err.stack);
  }

  // Handle known API errors
  if (err instanceof ApiError) {
    // Map error type to error code
    let errorCode = 'UNKNOWN_ERROR';
    if (err.constructor.name === 'ValidationError') errorCode = 'VALIDATION_ERROR';
    else if (err.constructor.name === 'UnauthorizedError') errorCode = 'UNAUTHORIZED';
    else if (err.constructor.name === 'ForbiddenError') errorCode = 'FORBIDDEN';
    else if (err.constructor.name === 'NotFoundError') errorCode = 'NOT_FOUND';
    else if (err.constructor.name === 'ConflictError') errorCode = 'CONFLICT';
    else if (err.constructor.name === 'BadRequestError') errorCode = 'BAD_REQUEST';

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: errorCode,
      ...(err instanceof ValidationError && err.errors && { errors: err.errors }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: 'VALIDATION_ERROR',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        field: (err.meta?.target as string[])?.[0] || 'unknown',
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Foreign key constraint violation
    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference to related record',
      });
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma Validation Error:', err); // Debug log
    return res.status(400).json({
      success: false,
      message: 'Invalid data provided',
    });
  }

  // Default to 500 Internal Server Error
  const statusCode = 500;
  const message =
    config.env === 'production'
      ? 'An unexpected error occurred'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

/**
 * Handle 404 Not Found
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
