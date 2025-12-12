// Currency configuration and utilities
export interface CurrencyConfig {
    code: string;
    symbol: string;
    locale: string;
    conversionRate: number; // Relative to INR base price
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
    INR: {
        code: 'INR',
        symbol: '₹',
        locale: 'en-IN',
        conversionRate: 1,
    },
    USD: {
        code: 'USD',
        symbol: '$',
        locale: 'en-US',
        conversionRate: 0.0111, // 1 INR ≈ 0.0111 USD (User specified: 499 INR ≈ 5.52 USD)
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        locale: 'de-DE',
        conversionRate: 0.011, // 1 INR ≈ 0.011 EUR
    },
    GBP: {
        code: 'GBP',
        symbol: '£',
        locale: 'en-GB',
        conversionRate: 0.0095, // 1 INR ≈ 0.0095 GBP
    },
    AUD: {
        code: 'AUD',
        symbol: 'A$',
        locale: 'en-AU',
        conversionRate: 0.018, // 1 INR ≈ 0.018 AUD
    },
    CAD: {
        code: 'CAD',
        symbol: 'C$',
        locale: 'en-CA',
        conversionRate: 0.017, // 1 INR ≈ 0.017 CAD
    },
};

// Country to currency mapping
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
    US: 'USD',
    IN: 'INR',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    AU: 'AUD',
    CA: 'CAD',
    // Add more countries as needed
};

/**
 * Get currency symbol from currency code
 */
export function getCurrencySymbol(currencyCode: string = 'INR'): string {
    return CURRENCIES[currencyCode]?.symbol || '₹';
}

/**
 * Get currency config from currency code
 */
export function getCurrencyConfig(currencyCode: string = 'INR'): CurrencyConfig {
    return CURRENCIES[currencyCode] || CURRENCIES.INR;
}

/**
 * Convert price from INR to target currency
 */
export function convertPrice(priceInINR: number, targetCurrency: string = 'INR'): number {
    const config = getCurrencyConfig(targetCurrency);
    const convertedPrice = priceInINR * config.conversionRate;

    // Round to appropriate decimal places based on currency
    if (targetCurrency === 'INR') {
        return Math.round(convertedPrice);
    }
    return Math.round(convertedPrice * 100) / 100;
}

/**
 * Format price with currency symbol and locale
 */
export function formatPrice(price: number, currencyCode: string = 'INR'): string {
    const config = getCurrencyConfig(currencyCode);
    return `${config.symbol}${price.toLocaleString(config.locale)}`;
}

/**
 * Get currency from country code
 */
export function getCurrencyFromCountry(countryCode: string): string {
    return COUNTRY_TO_CURRENCY[countryCode] || 'INR';
}

/**
 * Detect user's currency from browser/request headers
 * This is a client-side helper
 */
export function detectUserCurrency(): string {
    if (typeof window === 'undefined') return 'INR';

    try {
        // Try to get from browser's locale
        const locale = navigator.language || 'en-IN';

        // Extract country code from locale (e.g., 'en-US' -> 'US')
        const countryCode = locale.split('-')[1]?.toUpperCase();

        if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
            return COUNTRY_TO_CURRENCY[countryCode];
        }
    } catch (error) {
        console.error('Error detecting currency:', error);
    }

    return 'INR'; // Default fallback
}
