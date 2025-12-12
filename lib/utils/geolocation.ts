import { headers } from 'next/headers';
import { getCurrencyFromCountry } from './currency';

/**
 * Detect user's country from IP address using request headers
 * This works on server-side (Server Components and API Routes)
 */
export async function detectUserCountryServer(): Promise<string> {
    try {
        const headersList = await headers();

        // Try Cloudflare header first (if deployed on Cloudflare)
        const cfCountry = headersList.get('cf-ipcountry');
        if (cfCountry && cfCountry !== 'XX') {
            return cfCountry;
        }

        // Try Vercel geolocation header
        const vercelCountry = headersList.get('x-vercel-ip-country');
        if (vercelCountry) {
            return vercelCountry;
        }

        // Try other common headers
        const country = headersList.get('x-country-code') ||
            headersList.get('x-geo-country');
        if (country) {
            return country;
        }

        // Fallback: try to detect from accept-language header
        const acceptLanguage = headersList.get('accept-language');
        if (acceptLanguage) {
            // Parse accept-language header (e.g., "en-US,en;q=0.9")
            const match = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})/);
            if (match && match[1]) {
                return match[1];
            }
        }
    } catch (error) {
        console.error('Error detecting country:', error);
    }

    return 'IN'; // Default to India
}

/**
 * Detect user's currency from IP address
 */
export async function detectUserCurrencyServer(): Promise<string> {
    const country = await detectUserCountryServer();
    return getCurrencyFromCountry(country);
}
