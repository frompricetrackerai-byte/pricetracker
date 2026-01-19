import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                    <p>By using Price Tracker AI, you agree to these terms. If you do not agree, please do not use our service.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                    <p>Price Tracker AI provides tools to monitor prices on external e-commerce websites. We are not affiliated with these websites (Amazon, Flipkart, etc.).</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                    <p>You agree not to use the service for any illegal purposes or to scrape our data for commercial use without permission.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
                    <p>The service is provided "as is". While we strive for 100% accuracy, we cannot guarantee that price alerts will always be instant or accurate due to changes on external sites.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                    <p>Price Tracker AI is not responsible for any purchases made based on price alerts. Always verify the price on the retailer's site before buying.</p>
                </section>
                <div className="pt-8 border-t border-gray-200">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
