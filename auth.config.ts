import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            console.log(`[Middleware] Path: ${nextUrl.pathname}, IsLoggedIn: ${isLoggedIn}, User: ${auth?.user?.email}`);
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;

                // Priority:
                // 1. AUTH_URL (Explicit Production override)
                // 2. VERCEL_URL (Automatic for Vercel Previews/Deployments)
                let baseUrl = process.env.AUTH_URL;

                // VERCEL_URL handling (only if not localhost/development)
                // We avoid template literals to prevent hidden character issues
                const vercelEnvUrl = process.env.VERCEL_URL;
                if (!baseUrl && vercelEnvUrl && !vercelEnvUrl.includes('localhost')) {
                    // Manually construct to be safe
                    baseUrl = 'https://' + vercelEnvUrl;
                }

                // Fallback to hardcoded domain in production to prevent localhost redirects
                if (!baseUrl && process.env.NODE_ENV === 'production') {
                    baseUrl = 'https://www.pricetracker.store';
                }

                // Default local fallback
                if (!baseUrl) {
                    baseUrl = nextUrl.origin;
                }

                // PARANOID/BUILD FIX: Validate baseUrl before using
                try {
                    const testUrl = new URL(baseUrl);
                    // Ensure protocol is http or https
                    if (testUrl.protocol !== 'http:' && testUrl.protocol !== 'https:') {
                        throw new Error('Invalid protocol');
                    }
                } catch (e) {
                    // Critical fallback for static build or invalid vars
                    // This guarantees build cannot crash on invalid URL
                    baseUrl = 'http://localhost:3000';
                }

                const loginUrl = new URL('/login', baseUrl);

                // Ensure callback URL is also correct
                loginUrl.searchParams.set('callbackUrl', nextUrl.href);
                return Response.redirect(loginUrl);
            } else if (isLoggedIn) {
                // Redirect authenticated users to dashboard if they visit login/signup
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
