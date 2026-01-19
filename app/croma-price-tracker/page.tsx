import { Metadata } from 'next';
import { StoreLandingPage } from '@/components/seo/StoreLandingPage';

export const metadata: Metadata = {
    title: 'Croma Price Tracker - Track Croma Price History | Price Tracker AI',
    description: 'Track prices on Croma.com and get instant alerts via WhatsApp. View Croma price history graphs and buy at the lowest price possible.',
    keywords: ['croma price tracker', 'croma price history', 'track croma price', 'croma price drop alert', 'croma sale tracker'],
    openGraph: {
        title: 'Croma Price Tracker - Save on Electronics',
        description: 'Monitor electronics on Croma and get instant alerts for price drops. The best tool for Croma shoppers.',
    }
};

export default function CromaPage() {
    return (
        <StoreLandingPage
            storeName="Croma"
            storeColor="text-[#00BFA5]"
            themeGradient="from-[#E0F2F1] via-white to-white"
            heroTitle="Track Every Deal on Croma"
            heroDescription="Never miss a price drop on Croma again. Our AI-powered tracker monitors gadgets, appliances, and electronics 24/7."
            features={[
                "Croma Price Monitoring",
                "Instant Alerts on WhatsApp",
                "Electronics Sale Alerts",
                "Historical Price Trends",
                "Stock Availability Alerts",
                "Free for Croma Shoppers"
            ]}
            faq={[
                {
                    question: "How to track prices on Croma.com?",
                    answer: "Copy the Croma product link, paste it into Price Tracker AI, and we will start monitoring it. You will get an alert when the price falls."
                },
                {
                    question: "Does it work for Croma mobile app?",
                    answer: "Yes, you can share the link from the app to our tracker to start monitoring instantly."
                },
                {
                    question: "Is the Croma price tracker free?",
                    answer: "Yes! You can track several Croma products for free. Premium plans are available for extensive tracking."
                }
            ]}
        />
    );
}
