import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Middleware to validate request data using Zod
 * @param schema Zod schema to validate against
 * @param source Source of data to validate: 'body', 'query', or 'params'
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync(req[source]);

            // Replace original data with validated/transformed data
            req[source] = validatedData;

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to validate multiple sources at once
 * @param schemas Object containing schemas for body, query, and/or params
 */
export const validateBulk = (schemas: {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
}) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
