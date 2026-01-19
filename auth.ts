import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    events: {
        async createUser({ user }) {
            if (user.email) {
                const { sendWelcomeEmail, sendAdminNewUserAlert } = await import('@/lib/mail/send-welcome');
                await sendWelcomeEmail(user.email, user.name || null);
                await sendAdminNewUserAlert(user.email, user.name || null);
            }
        },
        async signIn({ user }) {
            if (user.id) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { lastLoginAt: new Date() }
                    });
                } catch (error) {
                    console.error('Failed to update last login time:', error);
                }
            }
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    if (!user.password) return null; // User might have signed up with OAuth (future proofing)

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@example.com')
                .split(',')
                .map(e => e.trim().toLowerCase());

            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.subscriptionTier = user.subscriptionTier;

                if (user.email) {
                    // @ts-ignore
                    token.isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.subscriptionTier = token.subscriptionTier as string;
                // @ts-ignore
                session.user.isAdmin = token.isAdmin as boolean;
            }
            return session;
        },
    },
});
