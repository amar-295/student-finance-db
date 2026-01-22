import prisma from '../config/database';

async function getDbStats() {
    console.log('📊 Fetching Database Statistics...');

    const tables = [
        'user',
        'account',
        'category',
        'transaction',
        'budget',
        'group',
        'groupMember',
        'billSplit',
        'splitParticipant',
        'paymentReminder',
        'insight',
        'aICategoryCache',
        'notificationSettings',
        'notification',
        'report',
        'refreshToken',
        'passwordReset',
        'auditLog'
    ];

    const stats: Record<string, number> = {};

    for (const table of tables) {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const count = await prisma[table].count();
            stats[table] = count;
        } catch (error: any) {
            console.error(`Error counting ${table}:`, error.message);
            stats[table] = -1;
        }
    }

    console.table(stats);
    process.exit(0);
}

getDbStats();
