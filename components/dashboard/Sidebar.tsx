'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, CreditCard, Settings, LogOut, Bell, Shield, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingCart },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Support', href: '/dashboard/support', icon: MessageCircleQuestion },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@example.com').split(',').map(e => e.trim());

    // DEBUG: Check what email the session has vs what looks like an admin
    if (session?.user?.email) {
        console.log("Current Session Email:", session.user.email);
        console.log("Is Admin?", ADMIN_EMAILS.includes(session.user.email));
    }

    const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-6 flex h-32 items-end justify-start rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 shadow-lg shadow-blue-200 transition-transform hover:scale-[1.02]"
                href="/"
            >
                <div className="w-32 text-white md:w-40">
                    <h1 className="text-xl font-black tracking-tight">Price Tracker AI</h1>
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                'flex h-[52px] min-w-[52px] md:w-auto grow items-center justify-center gap-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 p-3 text-sm font-medium text-slate-600 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow-sm md:flex-none md:justify-start md:p-3 md:px-4',
                                {
                                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border-transparent hover:from-blue-700 hover:to-indigo-700 hover:text-white': pathname === link.href,
                                },
                            )}
                        >
                            <LinkIcon className="w-5 h-5" />
                            <p className="hidden md:block">{link.name}</p>
                        </Link>
                    );
                })}
                {isAdmin && (
                    <Link
                        href="/dashboard/admin"
                        className={cn(
                            'flex h-[52px] grow items-center justify-center gap-3 rounded-xl bg-white/50 p-3 text-sm font-medium text-slate-600 transition-all hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 hover:shadow-sm md:flex-none md:justify-start md:p-3 md:px-4',
                            {
                                'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600 hover:text-white': pathname === '/dashboard/admin',
                            },
                        )}
                    >
                        <Shield className="w-5" />
                        <p className="hidden md:block">Admin</p>
                    </Link>
                )}
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                <Button
                    variant="ghost"
                    className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-xl bg-white/50 p-3 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow-sm transition-all md:flex-none md:justify-start md:p-2 md:px-3 text-slate-600"
                    onClick={async () => {
                        // Client-side sign out with explicit redirect to custom domain
                        await signOut({ redirect: false });
                        window.location.href = 'https://pricetracker.store/';
                    }}
                >
                    <LogOut className="w-6" />
                    <div className="hidden md:block">Sign Out</div>
                </Button>
            </div>
        </div>
    );
}
