import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pino from 'pino-http';
import rateLimit from 'express-rate-limit';
import config from './config/env';
import logger from './config/logger';
import { errorHandler, notFoundHandler, optionalAuthenticate } from './middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import transactionRoutes from './routes/transaction.routes';
import accountRoutes from './routes/account.routes';
import budgetRoutes from './routes/budget.routes';
import categoryRoutes from './routes/category.routes';
import groupRoutes from './routes/group.routes';
import billSplitRoutes from './routes/bill-split.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import reportRoutes from './routes/report.routes';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

const app: Application = express();

// Trust proxy for Render/Load Balancer
app.set('trust proxy', 1);

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress all routes
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (User-based if authenticated, IP-based otherwise)
app.use('/api', optionalAuthenticate);

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // If optionalAuthenticate found a user, use userId as the key
    return req.user?.userId || req.ip || 'unknown';
  },
});
app.use('/api', limiter);

// Logging middleware
app.use(pino({ logger }));

// Health check routes
app.use('/health', healthRoutes);

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to Student Finance Dashboard API',
    documentation: '/api-docs',
    health: '/health',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/bill-splits', billSplitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;