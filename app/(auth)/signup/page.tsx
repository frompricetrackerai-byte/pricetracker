import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up | Price Tracker AI',
};

export default function SignupPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:h-[600px]">
                {/* Left Side - Form */}
                <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">Hello, Friend!</h1>
                        <p className="mt-2 text-gray-600">Create your account to start tracking.</p>
                    </div>
                    <SignupForm />
                </div>

                {/* Right Side - Blue/Decorative */}
                <div className="hidden w-1/2 flex-col justify-center bg-blue-600 p-12 text-white md:flex relative overflow-hidden">
                    {/* One Wave Design */}
                    <div className="absolute top-0 bottom-0 -left-1 w-24 h-full z-20">
                        <svg className="h-full w-full text-white fill-current" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M0 0 C 40 10 40 90 0 100 Z" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-center pl-8">
                        <h2 className="text-4xl font-bold mb-4">Glad to see you!</h2>
                        <p className="text-lg text-blue-100">Welcome! Please fill these blanks for sign up your account.</p>
                    </div>

                    {/* Decorative Shapes */}{/* Subtle curve effect */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl"></div>
                </div>
            </div>
        </main>
    );
}
