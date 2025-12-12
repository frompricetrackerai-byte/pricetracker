import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import PaymentVerificationHandler from '@/components/subscription/PaymentVerificationHandler';
import BillingCards from '@/components/subscription/BillingCards';
import { detectUserCurrencyServer } from '@/lib/utils/geolocation';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    const isPremium = user?.subscriptionTier === 'premium';

    // Detect user's currency based on their location
    const userCurrency = await detectUserCurrencyServer();

    return (
        <div className="max-w-4xl mx-auto">
            <PaymentVerificationHandler />
            <h1 className="text-2xl font-bold mb-6">Subscription & Billing</h1>

            <BillingCards isPremium={isPremium} serverCurrency={userCurrency} />
        </div>
    );
}
