'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { registerUser, verifyOtpAndLogin } from '@/app/actions/auth-actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GoogleSignInButton } from './GoogleSignInButton';

export default function SignupForm() {
    const [step, setStep] = useState<'REGISTER' | 'VERIFY'>('REGISTER');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    async function handleRegister(formData: FormData) {
        setLoading(true);
        const res = await registerUser(formData);
        setLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else if (res.success && res.email) {
            setEmail(res.email);
            setStep('VERIFY');
            toast.success('OTP sent to your email!');
        }
    }

    async function handleVerify(formData: FormData) {
        setLoading(true);
        const otp = formData.get('otp') as string;
        const res = await verifyOtpAndLogin(email, otp);
        setLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success('Account verified! Please login.');
            router.push('/login');
        }
    }

    return (
        <div className="w-full">
            {step === 'REGISTER' ? (
                <>
                    <div className="mb-6">
                        <Suspense fallback={<div className="h-12 bg-slate-100 rounded-lg animate-pulse" />}>
                            <GoogleSignInButton text="Sign up with Google" />
                        </Suspense>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400">
                                    Or sign up with
                                </span>
                            </div>
                        </div>
                    </div>
                    <form action={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required className="bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile (Optional)</Label>
                            <Input id="mobile" name="mobile" type="tel" placeholder="+91 9876543210" className="bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>

                        <div className="pt-4 flex flex-col gap-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-lg shadow-blue-200" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Create Account'}
                            </Button>
                            <div className="text-center text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <form action={handleVerify} className="space-y-6">
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold">Verify Email</h3>
                            <p className="text-sm text-gray-500">Enter code sent to {email}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp" className="sr-only">Enter OTP</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                placeholder="1 2 3 4 5 6"
                                required
                                maxLength={6}
                                className="text-center text-3xl tracking-[1em] h-16 font-mono bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Create Account'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setStep('REGISTER')}
                            className="text-sm underline text-zinc-500 hover:text-blue-600"
                        >
                            Change Email
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
