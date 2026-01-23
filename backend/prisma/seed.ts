import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('Password123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Student',
      password: hashedPassword,
      baseCurrency: 'USD',
    },
  });
  console.log(`👤 Created user: ${user.email}`);

  // Create System Categories
  const categories = [
    { name: 'Food & Dining', type: 'expense', icon: 'restaurant', color: '#FF6B6B' },
    { name: 'Transportation', type: 'expense', icon: 'directions_car', color: '#4ECDC4' },
    { name: 'Shopping', type: 'expense', icon: 'shopping_bag', color: '#45B7D1' },
    { name: 'Entertainment', type: 'expense', icon: 'movie', color: '#F7B731' },
    { name: 'Education', type: 'expense', icon: 'school', color: '#5F27CD' },
    { name: 'Income', type: 'income', icon: 'payments', color: '#26DE81' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        userId_name: { userId: user.id, name: cat.name }
      },
      update: {},
      create: {
        ...cat,
        userId: user.id,
        isSystem: true // Wait, schema says boolean? Let's check schema.
        // Actually schema says isSystem is boolean. user_id is required? 
        // Let's attach to this user for now as a template.
      },
    });
  }
  console.log('📂 Categories created');

  console.log('✨ Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
