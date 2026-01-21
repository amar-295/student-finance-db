import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

beforeEach(async () => {
    // Clean database before each test
    // Order matters due to foreign keys
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.billSplit.deleteMany();
    await prisma.account.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();
});

export { prisma };
