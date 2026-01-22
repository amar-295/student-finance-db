/**
 * Express type extensions
 * Augment Express types with custom properties
 */

declare global {
  namespace Express {
    interface Request {
      id?: string;
      token?: string;
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export {};
