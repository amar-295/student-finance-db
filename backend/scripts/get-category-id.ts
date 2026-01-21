import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function getCategoryId() {
  const foodCategory = await prisma.category.findFirst({
    where: { name: 'Food & Dining', isSystem: true },
  });
  
  console.log('Food & Dining Category ID:', foodCategory?.id);
  return foodCategory?.id;
}

getCategoryId()
  .finally(() => prisma.$disconnect());
