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
                // 2. VERCEL_URL (Automatic for Vercel Previews/Deployments) - Note: Vercel doesn't include https://
                // 3. nextUrl.origin (Localhost fallback)
                let baseUrl = process.env.AUTH_URL;
                if (!baseUrl && process.env.VERCEL_URL) {
                    baseUrl = `https://${process.env.VERCEL_URL}`;
                }
                baseUrl = baseUrl || nextUrl.origin;

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
