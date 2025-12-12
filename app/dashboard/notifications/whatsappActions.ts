'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { sendTestWhatsApp, validateWhatsAppPhone, formatWhatsAppPhone } from '@/lib/notifications/whatsapp';

export async function updateWhatsAppPhone(phone: string) {
    try {
        const session = await auth();
        let userEmail = session?.user?.email;

        if (!userEmail) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) userEmail = firstUser.email;
        }

        if (!userEmail) {
            return { error: 'User not found' };
        }

        // Validate and format phone number
        if (!validateWhatsAppPhone(phone)) {
            return { error: 'Invalid phone number format' };
        }

        const formattedPhone = formatWhatsAppPhone(phone);

        // Update user's WhatsApp phone number and enable notifications
        await prisma.user.update({
            where: { email: userEmail },
            data: {
                whatsappPhone: formattedPhone,
                whatsappNotifications: true,
            },
        });

        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (e: any) {
        console.error('WhatsApp Phone Update Error:', e);
        return { error: `Server Error: ${e.message}` };
    }
}

export async function sendTestWhatsAppNotification() {
    try {
        const session = await auth();
        let userEmail = session?.user?.email;

        if (!userEmail) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) userEmail = firstUser.email;
        }

        if (!userEmail) {
            return { error: 'User not found' };
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user?.whatsappPhone) {
            return { error: 'WhatsApp number not configured' };
        }

        // Check if access token is configured
        if (!process.env.WHATSAPP_ACCESS_TOKEN) {
            return {
                error: 'WhatsApp Business API not configured. Please set WHATSAPP_ACCESS_TOKEN in environment variables.'
            };
        }

        // Send test message
        const sent = await sendTestWhatsApp(user.whatsappPhone);

        if (!sent) {
            return {
                error: 'WhatsApp Business API requires approved message templates. Please create and approve a test template in Meta Business Manager first. See docs/WHATSAPP_SETUP.md for details.'
            };
        }

        // Record notification in database
        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'whatsapp',
                message: `Test WhatsApp notification sent to ${user.whatsappPhone}`,
                isRead: true,
            },
        });

        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (e: any) {
        console.error('WhatsApp Test Error:', e);
        return { error: `Failed to send test message: ${e.message}` };
    }
}

export async function disconnectWhatsApp() {
    try {
        const session = await auth();
        if (!session?.user?.email) return { error: 'User not found' };

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                whatsappPhone: null,
                whatsappNotifications: false,
            },
        });

        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (e: any) {
        console.error('WhatsApp Disconnect Error:', e);
        return { error: `Failed to disconnect: ${e.message}` };
    }
}

export async function toggleWhatsAppNotifications(enabled: boolean) {
    try {
        const session = await auth();
        let userEmail = session?.user?.email;

        if (!userEmail) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) userEmail = firstUser.email;
        }

        if (!userEmail) {
            return { error: 'User not found' };
        }

        await prisma.user.update({
            where: { email: userEmail },
            data: { whatsappNotifications: enabled },
        });

        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (e: any) {
        console.error('WhatsApp Toggle Error:', e);
        return { error: `Failed to toggle: ${e.message}` };
    }
}
