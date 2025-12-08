import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up | Price Tracker AI',
};

export default function SignupPage() {
    return (
        <main className="flex items-center justify-center md:h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-xl shadow-blue-200 md:h-36 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-32 text-white md:w-36">
                        <h1 className="text-2xl font-black tracking-tighter drop-shadow-md">Price Tracker AI</h1>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <SignupForm />
                </div>
            </div>
        </main>
    );
}
