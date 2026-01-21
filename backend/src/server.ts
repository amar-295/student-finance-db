/**
 * © 2026 Amarnath Sharma
 * Licensed under the MIT License
 */
import app from './app';
import config from './config/env';
import prisma from './config/database';

const PORT = config.port;

// Test database connection
const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testDatabaseConnection();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎓 Student Finance Dashboard API                        ║
║                                                            ║
║   Environment: ${config.env.padEnd(44)}║
║   Port: ${PORT.toString().padEnd(51)}║
║   URL: http://localhost:${PORT}${' '.repeat(33)}║
║                                                            ║
║   📚 API Documentation: http://localhost:${PORT}/api${' '.repeat(17)}║
║   🏥 Health Check: http://localhost:${PORT}/health${' '.repeat(13)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
