
import { Metadata } from 'next';
import { StoreLandingPage } from '@/components/seo/StoreLandingPage';

export const metadata: Metadata = {
    title: 'Ajio Price Tracker - Price Drops & Trends | Price Tracker AI',
    description: 'Track Ajio product prices effortlessly. Get alerts for Ajio Mania sales and price drops on your favorite fashion items.',
    keywords: ['ajio price tracker', 'ajio price history', 'ajio sale alert', 'track ajio price', 'ajio mania tracker'],
    openGraph: {
        title: 'Ajio Price Tracker - Smart Fashion Shopping',
        description: 'Monitor Ajio prices and get alerts when your favorite sneakers or clothes go on sale.',
    }
};

export default function AjioPage() {
    return (
        <StoreLandingPage
            storeName="Ajio"
            storeColor="text-[#2C4152]"
            themeGradient="from-slate-50 via-white to-white"
            heroTitle="Ajio Price Drop Tracker"
            heroDescription="Ajio has some of the best deals, but they go fast. Track products and grab them before they go out of stock or the price increases."
            features={[
                "Ajio Mania Sale Tracking",
                "Sneaker Price Alerts",
                "Price History Insights",
                "Instant Notifications",
                "Simple & Free to Use",
                "No Spam, Just Alerts"
            ]}
            faq={[
                {
                    question: "Does this work for Ajio Luxe?",
                    answer: "Yes, you can track products from both the regular Ajio store and Ajio Luxe."
                },
                {
                    question: "How reliable are the alerts?",
                    answer: "We check prices around the clock. You should receive an alert within minutes of a price change on Ajio."
                },
                {
                    question: "Is there an app?",
                    answer: "Price Tracker AI is a web app optimized for mobile. You can add it to your home screen for an app-like experience."
                }
            ]}
        />
    );
}
