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

                {/* Right Side - Purple Cloud/Decorative */}
                <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-12 text-white md:flex relative overflow-hidden">
                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl font-bold mb-4">Glad to see you!</h2>
                        <p className="text-lg text-purple-100">Welcome! Please fill these blanks for sign up your account.</p>
                    </div>

                    {/* Decorative Clouds (CSS Shapes) */}
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl"></div>
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>
            </div>
        </main>
    );
}
