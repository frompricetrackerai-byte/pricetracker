'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Link2, Loader2, Rocket, AlertCircle } from 'lucide-react';

export default function AddProductForm() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'collecting' | 'success'>('idle');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('analyzing');
        setError('');

        // Fake stage transition for analyzing -> collecting
        const collectingTimer = setTimeout(() => {
            if (status !== 'success') setStatus('collecting');
        }, 2000);

        try {
            const res = await fetch('/api/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add product');
            }

            clearTimeout(collectingTimer);
            setStatus('success'); // Green success state

            // Allow user to see success message before redirecting
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1000);

        } catch (err: any) {
            clearTimeout(collectingTimer);
            setStatus('idle');
            setError(err.message);
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'analyzing':
                return (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                    </>
                );
            case 'collecting':
                return (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Collecting product details...
                    </>
                );
            case 'success':
                return (
                    <>
                        <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        Added Successfully!
                    </>
                );
            default:
                return (
                    <>
                        <Rocket className="mr-2 h-5 w-5" />
                        Track Product
                    </>
                );
        }
    };

    return (
        <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 overflow-hidden relative">
            {/* ... keep decorative elements ... */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-bl-full opacity-50 -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-tr-full opacity-50 -ml-6 -mb-6"></div>

            <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Link2 className="h-5 w-5" />
                    </div>
                    Add Product URL
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 relative z-10">
                    <div className="space-y-2">
                        <Label htmlFor="url" className="text-sm font-semibold text-zinc-700">Product URL</Label>
                        <div className="relative">
                            <Input
                                id="url"
                                placeholder="https://amazon.in/dp/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                type="url"
                                className="pl-4 pr-4 py-6 text-base border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl transition-all duration-300 hover:border-purple-300"
                            />
                        </div>
                        <p className="text-xs text-zinc-400">Paste the full product URL from any supported store</p>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="relative z-10">
                    <Button
                        disabled={status !== 'idle'}
                        type="submit"
                        className={`w-full py-6 text-base font-bold shadow-lg transition-all duration-300 rounded-xl
                            ${status === 'success'
                                ? 'bg-green-500 hover:bg-green-600 outline-none ring-2 ring-green-300'
                                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 hover:shadow-xl'
                            }
                        `}
                    >
                        {getButtonContent()}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
