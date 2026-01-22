
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting benchmark...');

  // 1. Setup
  // Note: This requires a running database configured in DATABASE_URL
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const email = `benchmark-${userId}@example.com`;

  console.log('Creating user and data...');
  try {
    await prisma.user.create({
      data: {
        id: userId,
        email,
        passwordHash: 'hashed',
        name: 'Benchmark User',
        accounts: {
          create: {
            id: accountId,
            name: 'Main Account',
            accountType: 'checking',
            currency: 'USD'
          }
        }
      }
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({ data: { userId, name: 'Salary', type: 'income', color: '#00FF00' } }),
      prisma.category.create({ data: { userId, name: 'Rent', type: 'expense', color: '#FF0000' } }),
      prisma.category.create({ data: { userId, name: 'Food', type: 'expense', color: '#0000FF' } }),
      prisma.category.create({ data: { userId, name: 'Fun', type: 'expense', color: '#FFFF00' } }),
    ]);

    const catIds = categories.map(c => c.id);

    // Create 5000 transactions
    const transactionsData = [];
    for (let i = 0; i < 5000; i++) {
      const isIncome = Math.random() > 0.8;
      const amount = isIncome ? (Math.random() * 1000 + 1000) : -(Math.random() * 100);
      const categoryId = catIds[Math.floor(Math.random() * catIds.length)];

      transactionsData.push({
        userId,
        accountId,
        categoryId,
        amount,
        merchant: `Merchant ${i}`,
        transactionDate: new Date(),
        description: `Benchmark transaction ${i}`,
      });
    }

    await prisma.transaction.createMany({
      data: transactionsData
    });

    console.log('Data created. Running benchmarks...');

    const where = { userId, deletedAt: null };

    // --- Benchmark 2: Current Optimized (GroupBy) ---
    const start2 = performance.now();

    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    const categoryIds = categoryStats
      .map(s => s.categoryId)
      .filter((id): id is string => id !== null);

    const fetchedCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });

    const categoryMap = new Map(fetchedCategories.map(c => [c.id, c]));

    let totalIncomeCurrent = 0;
    let totalExpensesCurrent = 0;
    const byCategoryCurrent: any = {};

    for (const stat of categoryStats) {
      // Logic from transaction.service.ts
      const amount = Number(stat._sum.amount || 0);
      const count = stat._count.id;

      // Handle Uncategorized (categoryId is null)
      if (!stat.categoryId) {
         if (amount > 0) totalIncomeCurrent += amount;
         else totalExpensesCurrent += Math.abs(amount);
         continue;
      }

      const category = categoryMap.get(stat.categoryId);
      const categoryName = category?.name || 'Unknown';

      if (category?.type === 'income') {
        totalIncomeCurrent += Math.abs(amount);
      } else {
        totalExpensesCurrent += Math.abs(amount);
      }

      byCategoryCurrent[categoryName] = { amount, count };
    }

    const end2 = performance.now();
    console.log(`[Current] Time: ${(end2 - start2).toFixed(2)}ms, Income: ${totalIncomeCurrent}, Expenses: ${totalExpensesCurrent}`);


    // --- Benchmark 3: Raw Query (Full) ---
    const start3 = performance.now();

    // Note: Raw query depends on DB provider. This is for Postgres.
    // For SQLite, replace "categories" with "Category" etc if table mapping differs?
    // No, @map works. But keep in mind syntax diffs.
    const rawStats = await prisma.$queryRaw`
      SELECT
        c.id as "categoryId",
        c.name as "categoryName",
        c.type as "categoryType",
        c.color as "categoryColor",
        SUM(t.amount) as "totalAmount",
        COUNT(t.id) as "count"
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ${userId} AND t.deleted_at IS NULL
      GROUP BY c.id, c.name, c.type, c.color
    `;

    let totalIncomeRaw = 0;
    let totalExpensesRaw = 0;
    const byCategoryRaw: any = {};

    if (Array.isArray(rawStats)) {
        for (const stat of rawStats) {
            const amount = Number(stat.totalAmount);
            const count = Number(stat.count);
            const categoryName = stat.categoryName || 'Uncategorized';
            const type = stat.categoryType;

            if (type === 'income') {
                 totalIncomeRaw += Math.abs(amount);
            } else if (type === 'expense') {
                 totalExpensesRaw += Math.abs(amount);
            } else {
               // Uncategorized
               if (amount > 0) totalIncomeRaw += amount;
               else totalExpensesRaw += Math.abs(amount);
            }

            byCategoryRaw[categoryName] = { amount, count };
        }
    }

    const end3 = performance.now();
    console.log(`[RawQuery] Time: ${(end3 - start3).toFixed(2)}ms, Income: ${totalIncomeRaw}, Expenses: ${totalExpensesRaw}`);

  } catch (error) {
    console.error('Benchmark failed:', error);
  } finally {
    // Cleanup
    console.log('Cleaning up...');
    try {
      await prisma.transaction.deleteMany({ where: { userId } });
      await prisma.category.deleteMany({ where: { userId } });
      await prisma.account.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    } catch(e) {
      console.error('Cleanup failed', e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
