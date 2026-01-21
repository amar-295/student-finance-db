import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean up existing data (optional, but good for reliable seeding)
  // Note: In production, rely on migration reset or manual cleanup. 
  // Here we assume a fresh or development DB where it's safe to upsert.

  // 2. Create Categories (Ensure system categories exist)
  console.log('📦 Seeding Categories...');
  const activeCategories = [
    { name: 'Food & Dining', type: 'expense', icon: 'restaurant' },
    { name: 'Transportation', type: 'expense', icon: 'directions_car' },
    { name: 'Shopping', type: 'expense', icon: 'shopping_bag' },
    { name: 'Entertainment', type: 'expense', icon: 'movie' },
    { name: 'Utilities', type: 'expense', icon: 'bolt' },
    { name: 'Housing', type: 'expense', icon: 'home' },
    { name: 'Education', type: 'expense', icon: 'school' },
    { name: 'Health', type: 'expense', icon: 'medical_services' },
    { name: 'Travel', type: 'expense', icon: 'flight' },
    { name: 'Income', type: 'income', icon: 'attach_money' },
    { name: 'Scholarship', type: 'income', icon: 'school' },
    { name: 'Freelance', type: 'income', icon: 'work' },
  ];

  for (const cat of activeCategories) {
    // Check if system category exists (userId: null)
    // We avoid upsert here because unique constraint on nullable userId can be tricky across DBs/Prisma versions
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        userId: null // System category
      }
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          isSystem: true,
          userId: null
        },
      });
    }
  }
  console.log('✅ Categories seeded');

  // 3. Create Demo User
  console.log('👤 Seeding Demo User...');
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

  // Notification settings
  await prisma.notificationSettings.upsert({
    where: { userId: alex.id },
    update: {},
    create: {
      userId: alex.id,
      budgetAlerts: true,
      paymentReminders: true, // Fixed: splitReminders -> paymentReminders
      pushNotifications: true, // Assuming this maps to paymentReceived/general
      insightNotifications: true,
    },
  });
  console.log('✅ User Alex created');

  // 4. Create Accounts
  console.log('💳 Seeding Accounts...');
  const checking = await prisma.account.create({
    data: {
      userId: alex.id,
      name: 'Chase Checking',
      accountType: 'checking',
      balance: 2450.75,
      currency: 'USD',
    },
  });

  const savings = await prisma.account.create({
    data: {
      userId: alex.id,
      name: 'High Yield Savings',
      accountType: 'savings',
      balance: 12000.00,
      currency: 'USD',
    },
  });

  const creditCard = await prisma.account.create({
    data: {
      userId: alex.id,
      name: 'Amex Gold',
      accountType: 'credit',
      balance: -450.20,
      currency: 'USD',
      institution: 'American Express'
    },
  });
  console.log('✅ Accounts created');

  // 5. Create Transactions
  console.log('💸 Seeding Transactions...');

  // Helpers to get IDs
  const getCat = async (name: string) => prisma.category.findFirst({ where: { name, userId: null } });

  const food = await getCat('Food & Dining');
  const transport = await getCat('Transportation');
  const shopping = await getCat('Shopping');
  const entertainment = await getCat('Entertainment');
  const utilities = await getCat('Utilities');
  const income = await getCat('Income');
  const scholarship = await getCat('Scholarship');

  const today = new Date();
  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() - days);
    return d;
  };

  const transactionsData = [
    // Income
    { acc: checking, cat: scholarship, amt: 2000, merch: 'University FinAid', desc: 'Semester Grant', date: daysAgo(20) },
    { acc: checking, cat: income, amt: 850, merch: 'Campus Bookstore', desc: 'Part-time wages', date: daysAgo(5) },

    // Expenses - Checking
    { acc: checking, cat: utilities, amt: -120.50, merch: 'Electric Co', desc: 'Monthly Bill', date: daysAgo(15) },
    { acc: checking, cat: utilities, amt: -45.00, merch: 'Water Dept', desc: 'Water Bill', date: daysAgo(15) },

    // Expenses - Credit Card
    { acc: creditCard, cat: food, amt: -54.30, merch: 'Dominos Pizza', desc: 'Study group food', date: daysAgo(2) },
    { acc: creditCard, cat: food, amt: -12.50, merch: 'Starbucks', desc: 'Coffee', date: daysAgo(1) },
    { acc: creditCard, cat: transport, amt: -25.00, merch: 'Uber', desc: 'Ride to downtown', date: daysAgo(3) },
    { acc: creditCard, cat: shopping, amt: -89.99, merch: 'Amazon', desc: 'Textbooks', date: daysAgo(10) },
    { acc: creditCard, cat: entertainment, amt: -15.00, merch: 'Netflix', desc: 'Subscription', date: daysAgo(12) },
    { acc: creditCard, cat: food, amt: -32.40, merch: 'Local Diner', desc: 'Lunch with Sarah', date: daysAgo(8) },
  ];

  for (const t of transactionsData) {
    if (!t.cat) continue;
    await prisma.transaction.create({
      data: {
        userId: alex.id,
        accountId: t.acc.id,
        categoryId: t.cat.id,
        amount: t.amt,
        merchant: t.merch,
        description: t.desc,
        transactionDate: t.date,
        currency: 'USD',
        aiCategorized: true,
        aiConfidence: 0.9,
      }
    });
  }
  console.log('✅ Transactions seeded');

  // 6. Create Budgets
  console.log('📉 Seeding Budgets...');
  if (food && entertainment) {
    // Food Budget
    const existingFoodBudget = await prisma.budget.findFirst({
      where: {
        userId: alex.id,
        categoryId: food.id,
        periodType: 'monthly'
      }
    });

    if (!existingFoodBudget) {
      await prisma.budget.create({
        data: {
          userId: alex.id,
          categoryId: food.id,
          amount: 400.00,
          periodType: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth(), 1),
          endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          alertThreshold: 80,
        }
      });
    }

    // Entertainment Budget
    const existingEntBudget = await prisma.budget.findFirst({
      where: {
        userId: alex.id,
        categoryId: entertainment.id,
        periodType: 'monthly'
      }
    });

    if (!existingEntBudget) {
      await prisma.budget.create({
        data: {
          userId: alex.id,
          categoryId: entertainment.id,
          amount: 100.00,
          periodType: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth(), 1),
          endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          alertThreshold: 90,
        }
      });
    }
  }
  console.log('✅ Budgets seeded');

  // 7. Group & Bills (Optional but good for demo)
  console.log('👥 Seeding Groups...');
  const group = await prisma.group.create({
    data: {
      name: 'Apartment 4B',
      description: 'Shared expenses',
      createdBy: alex.id, // Fixed: creatorId -> createdBy
      members: {
        create: {
          userId: alex.id,
          role: 'admin',
          joinedAt: new Date()
        }
      }
    }
  });
  console.log('✅ Group seeded');


  console.log('🎉 Seeding completed!');
  console.log('\n📧 Demo Login:');
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
