
import { Metadata } from 'next';
import { StoreLandingPage } from '@/components/seo/StoreLandingPage';

export const metadata: Metadata = {
    title: 'Amazon Price Tracker - Track Price History & Drops | Price Tracker AI',
    description: 'Track Amazon product prices, view price history charts, and get instant drop alerts via WhatsApp & Email. The best free Amazon price tracker tool.',
    keywords: ['amazon price tracker', 'amazon price history', 'track amazon price', 'amazon price drop alert', 'amazon deal finder'],
    openGraph: {
        title: 'Amazon Price Tracker - Never Miss a Deal',
        description: 'Track any Amazon product and get notified when the price drops. Save money automatically.',
    }
};

export default function AmazonPage() {
    return (
        <StoreLandingPage
            storeName="Amazon"
            storeColor="text-[#FF9900]"
            themeGradient="from-orange-50 via-white to-white"
            heroTitle="The Ultimate Amazon Price Tracker"
            heroDescription="Paste any Amazon product URL and let our AI monitor the price 24/7. We'll notify you instantly on WhatsApp when it drops."
            features={[
                "Real-time Amazon Price Checks",
                "Price History Graphs",
                "WhatsApp & Telegram Alerts",
                "Track Lightning Deals",
                "Out of Stock Alerts",
                "No Extension Needed"
            ]}
            faq={[
                {
                    question: "How do I track Amazon prices?",
                    answer: "Simply copy the product URL from the Amazon app or website, paste it into Price Tracker AI, set your target price, and we'll handle the rest."
                },
                {
                    question: "Is this Amazon price tracker free?",
                    answer: "Yes! You can track multiple Amazon products for free. We also offer premium plans for power users who want to track unlimited items."
                },
                {
                    question: "Does it work for Amazon India?",
                    answer: "Absolutely. We support Amazon.in, Amazon.com, Amazon.co.uk, and all other major Amazon regions."
                }
            ]}
        />
    );
}
