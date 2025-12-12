import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // Authenticate the cron job (Optional: check for specific header)
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new NextResponse('Unauthorized', { status: 401 });
        // }

        // Delete notifications older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deleted = await prisma.notification.deleteMany({
            where: {
                sentAt: {
                    lt: thirtyDaysAgo
                }
            }
        });

        return NextResponse.json({
            success: true,
            deletedCount: deleted.count,
            message: `Cleaned up ${deleted.count} notifications older than 30 days`
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
