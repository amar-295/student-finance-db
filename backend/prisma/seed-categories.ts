import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_CATEGORIES = [
    { name: 'Food & Dining', type: 'expense', icon: 'restaurant', color: '#EF4444' },
    { name: 'Transportation', type: 'expense', icon: 'directions_car', color: '#3B82F6' },
    { name: 'Shopping', type: 'expense', icon: 'shopping_bag', color: '#F59E0B' },
    { name: 'Entertainment', type: 'expense', icon: 'movie', color: '#8B5CF6' },
    { name: 'Education', type: 'expense', icon: 'school', color: '#06B6D4' },
    { name: 'Healthcare', type: 'expense', icon: 'local_hospital', color: '#EC4899' },
    { name: 'Utilities', type: 'expense', icon: 'bolt', color: '#14B8A6' },
    { name: 'Rent', type: 'expense', icon: 'home', color: '#6366F1' },
    { name: 'Groceries', type: 'expense', icon: 'shopping_cart', color: '#10B981' },
    { name: 'Scholarship', type: 'income', icon: 'school', color: '#F59E0B' },
    { name: 'Salary', type: 'income', icon: 'payments', color: '#10B981' },
    { name: 'Other', type: 'expense', icon: 'more_horiz', color: '#6B7280' },
];

async function seedCategories() {
    console.log('🌱 Seeding system categories...');

    for (const category of SYSTEM_CATEGORIES) {
        await prisma.category.upsert({
            where: {
                id: category.name, // Temporary: use name as unique key for upsert
            },
            update: {},
            create: {
                name: category.name,
                type: category.type,
                icon: category.icon,
                color: category.color,
                isSystem: true,
                userId: null,
            },
        });
        console.log(`✅ Created category: ${category.name}`);
    }

    console.log('🎉 Category seeding completed!');
}

seedCategories()
    .catch((e) => {
        console.error('❌ Category seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
