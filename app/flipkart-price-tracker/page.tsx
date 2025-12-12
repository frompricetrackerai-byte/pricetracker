
import { Metadata } from 'next';
import { StoreLandingPage } from '@/components/seo/StoreLandingPage';

export const metadata: Metadata = {
    title: 'Flipkart Price Tracker - Price History & Sale Alerts | Price Tracker AI',
    description: 'Track Flipkart prices and get notified on price drops. View Flipkart price history graphs to know the best time to buy.',
    keywords: ['flipkart price tracker', 'flipkart price history', 'track flipkart price', 'flipkart sale alert', 'big billion days tracker'],
    openGraph: {
        title: 'Flipkart Price Tracker - Save on Every Purchase',
        description: 'Monitor Flipkart products and get instant alerts for Big Billion Days and price drops.',
    }
};

export default function FlipkartPage() {
    return (
        <StoreLandingPage
            storeName="Flipkart"
            storeColor="text-[#2874F0]"
            themeGradient="from-blue-50 via-white to-white"
            heroTitle="Track Flipkart Prices & History"
            heroDescription="Don't overpay on Flipkart. Visualize price history trends and get instant alerts when your favorite products go on sale."
            features={[
                "Flipkart Price History Charts",
                "Big Billion Days Tracking",
                "Instant Drop Alerts",
                "Mobile App Compatible",
                "Stock Availability Checks",
                "Compare Prices"
            ]}
            faq={[
                {
                    question: "How to check Flipkart price history?",
                    answer: "Enhance your shopping with Price Tracker AI. Paste the Flipkart link, and we'll start generating a price history chart for you immediately."
                },
                {
                    question: "Does this work during Big Billion Days?",
                    answer: "Yes! This is the best time to use our tracker. Set your target prices for the sale, and we'll ping you the second the price drops."
                },
                {
                    question: "Can I track mobile phones on Flipkart?",
                    answer: "Yes, you can track mobiles, electronics, fashion, and any other category available on Flipkart."
                }
            ]}
        />
    );
}
