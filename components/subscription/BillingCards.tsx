'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import DodoPaymentButton from '@/components/subscription/DodoPaymentButton';
import { detectUserCurrency, convertPrice, formatPrice, getCurrencyConfig } from '@/lib/utils/currency';

interface BillingCardsProps {
    isPremium: boolean;
    serverCurrency?: string;
}

export default function BillingCards({ isPremium, serverCurrency }: BillingCardsProps) {
    const [currency, setCurrency] = useState(serverCurrency || 'INR');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Client-side currency detection as fallback
        if (!serverCurrency) {
            const detectedCurrency = detectUserCurrency();
            setCurrency(detectedCurrency);
        }
        setIsLoading(false);
    }, [serverCurrency]);

    // Base prices in INR
    const basePrices = {
        free: 0,
        premiumOriginal: 999,
        premiumDiscounted: 499,
    };

    // Convert prices to user's currency
    const prices = {
        free: convertPrice(basePrices.free, currency),
        premiumOriginal: convertPrice(basePrices.premiumOriginal, currency),
        premiumDiscounted: convertPrice(basePrices.premiumDiscounted, currency),
    };

    const currencyConfig = getCurrencyConfig(currency);

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card className={!isPremium ? 'border-blue-500 border-2' : ''}>
                <CardHeader>
                    <CardTitle>Free Plan</CardTitle>
                    <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-4">
                        {isLoading ? (
                            <span className="text-gray-400">Loading...</span>
                        ) : (
                            <>
                                {currencyConfig.symbol}{prices.free}
                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </>
                        )}
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Track up to 3 products
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Automated price updates
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Email alerts
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center py-2 bg-gray-100 rounded-md font-medium text-gray-500">
                        {isPremium ? 'Downgrade' : 'Current Plan'}
                    </div>
                </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className={isPremium ? 'border-blue-500 border-2 relative' : ''}>
                {isPremium && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                        Active
                    </div>
                )}
                <CardHeader>
                    <CardTitle>Premium Plan</CardTitle>
                    <CardDescription>For serious shoppers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-4 flex items-center gap-3">
                        {isLoading ? (
                            <span className="text-gray-400">Loading...</span>
                        ) : (
                            <>
                                <span className="line-through text-gray-400 text-2xl">
                                    {currencyConfig.symbol}{prices.premiumOriginal}
                                </span>
                                <span className="text-green-500">
                                    {currencyConfig.symbol}{prices.premiumDiscounted}
                                </span>
                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </>
                        )}
                    </div>
                    {!isLoading && currency !== 'INR' && (
                        <p className="text-xs text-muted-foreground mb-4">
                            Prices shown in {currencyConfig.code}. Payment processed in INR.
                        </p>
                    )}
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Track up to 100 products
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Faster price updates
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Priority alerts
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Price history charts
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" /> Notifications
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    {isPremium ? (
                        <div className="w-full text-center py-2 bg-green-100 text-green-700 rounded-md font-medium">
                            Active Subscription
                        </div>
                    ) : (
                        <DodoPaymentButton planId="pdt_0QvaUicdCeSK6ON7UOQdq" />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
