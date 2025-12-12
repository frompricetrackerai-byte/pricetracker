
import { Metadata } from 'next';
import { StoreLandingPage } from '@/components/seo/StoreLandingPage';

export const metadata: Metadata = {
    title: 'Myntra Price Tracker - Fashion Sale Alerts | Price Tracker AI',
    description: 'Track Myntra fashion prices. Get alerts for End of Reason Sale and daily price drops on clothes, shoes, and accessories.',
    keywords: ['myntra price tracker', 'myntra price history', 'myntra sale alert', 'fashion price tracker', 'track myntra price'],
    openGraph: {
        title: 'Myntra Price Tracker - Catch Fashion Deals',
        description: 'Never miss a Myntra sale. Track prices of your favorite brands and buy at the lowest price.',
    }
};

export default function MyntraPage() {
    return (
        <StoreLandingPage
            storeName="Myntra"
            storeColor="text-[#E40046]"
            themeGradient="from-pink-50 via-white to-white"
            heroTitle="Myntra Price & Sale Tracker"
            heroDescription="Fashion prices change daily. Track your wishlist on Myntra and get notified when the price drops to your budget."
            features={[
                "Track Fashion & Accessories",
                "End of Reason Sale Alerts",
                "Size Availability monitor",
                "Price History for Clothes",
                "Works with Myntra App Links",
                "Instant WhatsApp Alerts"
            ]}
            faq={[
                {
                    question: "Can I track specific sizes on Myntra?",
                    answer: "Currently, we track the main product price. If the product goes on sale, you will be notified regardless of size variation."
                },
                {
                    question: "How do I use the Myntra Price Tracker?",
                    answer: "Copy the product link from the Myntra app (Share > Copy Link), paste it into our dashboard, and set your target price."
                },
                {
                    question: "Is it safe to use?",
                    answer: "Yes, we only use the public product URL to check prices. We do not require access to your Myntra account."
                }
            ]}
        />
    );
}
