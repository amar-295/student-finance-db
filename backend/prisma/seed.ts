import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user (Alex Chen from persona)
  const alexPassword = await hashPassword('DemoPassword123');
  const alex = await prisma.user.upsert({
    where: { email: 'alex@demo.com' },
    update: {},
    create: {
      email: 'alex@demo.com',
      passwordHash: alexPassword,
      name: 'Alex Chen',
      university: 'State University',
      baseCurrency: 'USD',
      emailVerified: true,
    },
  });

  console.log('✅ Created demo user:', alex.email);

  // Create notification settings for Alex
  await prisma.notificationSettings.upsert({
    where: { userId: alex.id },
    update: {},
    create: {
      userId: alex.id,
      budgetAlerts: true,
      splitReminders: true,
      paymentReceived: true,
      aiInsights: true,
    },
  });

  // Create demo account
  const checkingAccount = await prisma.account.create({
    data: {
      userId: alex.id,
      name: 'Chase Checking',
      accountType: 'checking',
      balance: 1247.50,
      currency: 'USD',
    },
  });

  console.log('✅ Created demo account:', checkingAccount.name);

  // Get system categories
  const foodCategory = await prisma.category.findFirst({
    where: { name: 'Food & Dining', isSystem: true },
  });

  const scholarshipCategory = await prisma.category.findFirst({
    where: { name: 'Scholarship', isSystem: true },
  });

  // Create sample transactions
  if (foodCategory && scholarshipCategory) {
    await prisma.transaction.createMany({
      data: [
        {
          userId: alex.id,
          accountId: checkingAccount.id,
          categoryId: scholarshipCategory.id,
          amount: 2000,
          merchant: 'University Scholarship',
          description: 'Semester scholarship',
          transactionDate: new Date('2026-01-01'),
          currency: 'USD',
        },
        {
          userId: alex.id,
          accountId: checkingAccount.id,
          categoryId: foodCategory.id,
          amount: -5.75,
          merchant: 'Starbucks',
          description: 'Coffee',
          transactionDate: new Date('2026-01-15'),
          currency: 'USD',
          aiCategorized: true,
          aiConfidence: 0.95,
        },
        {
          userId: alex.id,
          accountId: checkingAccount.id,
          categoryId: foodCategory.id,
          amount: -25.00,
          merchant: 'DoorDash',
          description: 'Dinner delivery',
          transactionDate: new Date('2026-01-16'),
          currency: 'USD',
          aiCategorized: true,
          aiConfidence: 0.92,
        },
      ],
    });

    console.log('✅ Created sample transactions');
  }

  // Create sample budget
  if (foodCategory) {
    await prisma.budget.create({
      data: {
        userId: alex.id,
        categoryId: foodCategory.id,
        amount: 200,
        periodType: 'monthly',
        startDate: new Date('2026-01-01'),
        alertThreshold: 0.80,
      },
    });

    console.log('✅ Created sample budget');
  }

  console.log('🎉 Seeding completed!');
  console.log('\n📧 Demo account:');
  console.log('   Email: alex@demo.com');
  console.log('   Password: DemoPassword123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
