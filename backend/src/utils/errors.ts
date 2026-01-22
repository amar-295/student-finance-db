/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 Unprocessable Entity
 */
export class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    public errors?: any,
  ) {
    super(422, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(500, message, false); // Not operational
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
