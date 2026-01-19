import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                    <p>Welcome to Price Tracker AI. We value your privacy and are committed to protecting your personal data. This policy explains how we handle your information.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">2. Data We Collect</h2>
                    <p>We collect minimal data required to provide our service:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Account Info:</strong> Email address for login and notifications.</li>
                        <li><strong>Tracked Products:</strong> URLs and price targets you set.</li>
                        <li><strong>Device Info:</strong> IP address and browser type for security and analytics.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
                    <p>Your data is used solely to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Send price drop alerts via your chosen channels (Email, Telegram).</li>
                        <li>Maintain your dashboard of tracked products.</li>
                        <li>Improve our product tracking accuracy.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
                    <p>We do not sell your data. We use trusted third parties for specific functions:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Supabase/Prisma:</strong> For secure data storage.</li>
                        <li><strong>Resend:</strong> for sending notification emails.</li>
                        <li><strong>NextAuth:</strong> for secure authentication.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                    <p>You can delete your account and all associated data at any time through your profile settings.</p>
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
