import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // 1 second

const connectWithRetry = async (retries = 0) => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, retries);
      console.warn(`⚠️ Database connection failed. Retrying in ${delay}ms... (Attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectWithRetry(retries + 1);
    }
    console.error('❌ Failed to connect to database after multiple attempts:', error);
    process.exit(1);
  }
};

// Initial connection attempt (only in non-test env to avoid hanging jest)
if (process.env.NODE_ENV !== 'test') {
  connectWithRetry();
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
