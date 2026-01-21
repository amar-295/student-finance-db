import swaggerJsdoc from 'swagger-jsdoc';
import config from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Finance API',
            version: '1.0.0',
            description: 'API documentation for the Student Finance Application',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api`,
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        description: { type: 'string' },
                        amount: { type: 'number' },
                        date: { type: 'string', format: 'date-time' },
                        categoryId: { type: 'string', format: 'uuid' },
                        type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                        accountId: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'fail' },
                        message: { type: 'string' },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/types/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
