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
        // Final fallback: use a public Geo-IP API (client IP detection)
        try {
            const response = await fetch('https://ipapi.co/country_name/', { next: { revalidate: 3600 } });
            if (response.ok) {
                const country = await response.text();
                // If it returns a code like "IN" or "US", we use it
                if (country && country.length === 2) {
                    return country;
                }
                // If it returns full name, we might need mapping, but often these APIs have a /country/ endpoint for code
            }

            // Try another one if first fails: ipwho.is
            const ipWhoResponse = await fetch('https://ipwho.is/', { next: { revalidate: 3600 } });
            if (ipWhoResponse.ok) {
                const data = await ipWhoResponse.json();
                if (data && data.country_code) {
                    return data.country_code;
                }
            }
        } catch (e) {
            console.error('External geo-IP fallback failed:', e);
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
