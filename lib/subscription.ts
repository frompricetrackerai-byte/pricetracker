import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { unstable_cache } from "next/cache"

export async function checkAndDowngradeSubscription() {
    const session = await auth()
    if (!session?.user?.email) return

    // Cache the subscription check for 1 hour to prevent blocking DB calls on every request
    const checkSubscriptionStatus = unstable_cache(
        async (email: string) => {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, subscriptionTier: true, subscriptionEndDate: true }
            })

            if (!user || user.subscriptionTier !== 'premium' || !user.subscriptionEndDate) return null

            const isExpired = new Date() > new Date(user.subscriptionEndDate)

            if (isExpired) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionTier: 'free',
                        subscriptionStatus: 'expired'
                    }
                })
                console.log(`Downgraded user ${user.id} to free plan due to expiry.`)
                return 'expired'
            }
            return 'active'
        },
        [`user-subscription-${session.user.email}`],
        {
            tags: [`user-subscription-${session.user.email}`],
            revalidate: 3600 // 1 hour
        }
    )

    await checkSubscriptionStatus(session.user.email)
}
