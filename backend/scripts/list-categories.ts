import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listCategories() {
    const categories = await prisma.category.findMany({
        where: { isSystem: true },
        select: { id: true, name: true, type: true },
    });

    console.log('\n📋 System Categories:\n');
    categories.forEach(cat => {
        console.log(`${cat.name.padEnd(20)} | ${cat.type.padEnd(8)} | ${cat.id}`);
    });
}

listCategories()
    .finally(() => prisma.$disconnect());
