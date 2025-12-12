"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingDown, Bell, ShoppingBag } from "lucide-react";

interface StoreLandingPageProps {
    storeName: string;
    storeColor: string; // e.g., "text-orange-500" or hex
    storeLogo?: React.ReactNode;
    themeGradient: string; // e.g., "from-orange-50 to-white"
    heroTitle: string;
    heroDescription: string;
    features: string[];
    faq: { question: string; answer: string }[];
}

export function StoreLandingPage({
    storeName,
    storeColor,
    storeLogo,
    themeGradient,
    heroTitle,
    heroDescription,
    features,
    faq
}: StoreLandingPageProps) {
    return (
        <div className="flex min-h-screen flex-col bg-transparent">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                        <div className="bg-blue-600 text-white p-1 rounded-lg">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        Price Tracker AI
                    </Link>
                    <nav className="flex gap-4">
                        <Link href="/login">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40">
                                Start Tracking for Free
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* HERO SECTION */}
                <section className={`w-full pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-32 lg:pb-28 bg-gradient-to-b ${themeGradient}`}>
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-8 text-center max-w-5xl mx-auto">
                            <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm bg-white ${storeColor} border-current`}>
                                <span className="flex h-2 w-2 rounded-full bg-current mr-2 animate-pulse"></span>
                                {storeName} Price Tracker
                            </div>

                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                                {heroTitle}
                            </h1>

                            <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed">
                                {heroDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                                <Link href="/login">
                                    <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:scale-105 transition-all rounded-full group">
                                        Track {storeName} Prices Now
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="w-full py-20 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex flex-col p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                    <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm ${storeColor}`}>
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature}</h3>
                                    <p className="text-gray-500 text-sm">Automated tracking ensures you never miss a deal on {storeName}.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="w-full py-20 bg-gray-50">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
                            <p className="text-gray-500 mt-2">Everything you need to know about tracking {storeName} prices.</p>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {faq.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h3>
                                    <p className="text-gray-600">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="w-full py-20 bg-white border-t border-gray-100">
                    <div className="container px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                            Ready to save on {storeName}?
                        </h2>
                        <Link href="/login">
                            <Button size="lg" className="h-12 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                Start Tracking Free
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t bg-gray-50">
                <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                        <TrendingDown className="h-5 w-5 text-blue-600" />
                        Price Tracker AI
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Price Tracker AI. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": `${storeName} Price Tracker`,
                        "applicationCategory": "ShoppingApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "INR"
                        },
                        "description": heroDescription,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "250"
                        }
                    })
                }}
            />
        </div>
    );
}
