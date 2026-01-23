import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pino from 'pino-http';
import config from './config/env';
import corsOptions from './config/cors';
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

// Trust proxy for secure cookies and IP rate limiting behind load balancers
app.enable('trust proxy');

// Request timeout middleware (30s)
// Must be before other middleware
import timeout from 'connect-timeout';
app.use(timeout('30s'));

// Enforce HTTPS in production
if (config.env === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for some UI libraries
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        // Add HSTS headers for HTTPS enforcement
        upgradeInsecureRequests: [],
      },
    },
    // Enable HSTS (Strict-Transport-Security)
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false, // Disable for external resources
  })
); // Set security HTTP headers including CSP
app.use(compression()); // Compress all routes
app.use(cors(corsOptions)); // Secure CORS configuration

// Custom middleware to handle timeout errors
app.use((req, _res, next) => {
  if (!req.timedout) next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optional authentication for rate limiting key generation
app.use('/api', optionalAuthenticate);

// Apply API rate limiting
// Note: Specific endpoints (auth, etc.) have their own stricter rate limiters
import { apiLimiter } from './config/rateLimiting';
app.use('/api', apiLimiter);

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