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
                if (isLoggedIn) return true;

                // Use AUTH_URL if set, otherwise fall back to request origin
                // This prevents localhost redirects if the environment variable is correctly set
                const baseUrl = process.env.AUTH_URL || nextUrl.origin;
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
