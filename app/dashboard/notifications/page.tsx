
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Lock } from 'lucide-react';
import { toggleNotification, sendTestNotification } from './actions';
import ContactDetails from './ContactDetails';
import Link from 'next/link';
import { TestEmailButton } from '@/components/dashboard/TestEmailButton';
import { TelegramConnectButton } from './TelegramConnectButton';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const session = await auth();
    let userEmail = session?.user?.email;

    if (!userEmail) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) userEmail = firstUser.email;
    }

    if (!userEmail) return <div>No user found</div>;

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            notifications: {
                orderBy: { sentAt: 'desc' },
                take: 10
            }
        }
    });

    if (!user) return <div>User not found</div>;

    const isPremium = user.subscriptionTier === 'premium';

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
                <p className="text-muted-foreground mt-1">Manage how you receive alerts and updates.</p>
            </div>

            {/* Contact Info */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ContactDetails initialEmail={user.email} initialMobile={user.mobile} />
                </CardContent>
            </Card>

            {/* Channels Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Email Channel */}
                <Card className={`relative overflow-hidden border-0 shadow-lg transition-transform hover:scale-[1.02] ${user.emailNotifications ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 'bg-white'}`}>
                    {user.emailNotifications && <div className="absolute top-0 right-0 p-4 opacity-10"><Mail className="w-24 h-24" /></div>}
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 relative z-10">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Mail className={`h-5 w-5 ${user.emailNotifications ? 'text-white' : 'text-sky-600'}`} /> Email
                                </CardTitle>
                                <CardDescription className={user.emailNotifications ? 'text-blue-100' : ''}>Free for everyone.</CardDescription>
                            </div>
                            <form action={async () => { 'use server'; await toggleNotification('email', !user.emailNotifications); }}>
                                <Switch checked={user.emailNotifications} type="submit" className="data-[state=checked]:bg-white/20 data-[state=checked]:border-white" />
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TestEmailButton emailNotificationsEnabled={user.emailNotifications} />
                    </CardContent>
                </Card>

                {/* Telegram Channel (Premium) */}
                <Card className={`relative overflow-hidden border-0 shadow-lg transition-transform hover:scale-[1.02] ${user.telegramChatId ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white' : 'bg-white border-l-4 border-l-sky-400'}`}>
                    {user.telegramChatId && (
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            {/* Background Plane Icon */}
                            <svg className="w-24 h-24 text-white fill-current transform -rotate-12" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.38.12.1.1.13.22.14.31 0 .1-.01.28 0 .28z" />
                            </svg>
                        </div>
                    )}
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    {/* Official Telegram Circle Icon */}
                                    <svg className={`h-5 w-5 ${user.telegramChatId ? 'text-white' : 'text-[#0088cc]'} fill-current`} viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.38.12.1.1.13.22.14.31 0 .1-.01.28 0 .28z" />
                                    </svg>
                                    Telegram
                                    {isPremium && <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">Best</Badge>}
                                </CardTitle>
                                <CardDescription className={user.telegramChatId ? 'text-green-50' : ''}>Instant alerts via Bot.</CardDescription>
                            </div>
                            {!isPremium && <Lock className="h-6 w-6 text-amber-500 drop-shadow-sm" />}
                            {isPremium && user.telegramChatId && (
                                <Badge variant="outline" className="border-white/50 text-white bg-white/20">Connected</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isPremium ? (
                            <TelegramConnectButton
                                isConnected={!!user.telegramChatId}
                                initialToken={user.telegramConnectToken}
                            />
                        ) : (
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href="/dashboard/billing">Upgrade to Unlock</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>


                {/* Whatsapp (Coming Soon) */}
                <Card className="relative overflow-hidden border-0 shadow-sm border-dashed transition-transform hover:scale-[1.02] bg-[#25D366] opacity-90 text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-24 h-24 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="white" />
                        </svg>
                    </div>
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="white" />
                                    </svg> WhatsApp
                                </CardTitle>
                                <CardDescription className="text-green-50">Coming Soon</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <Button variant="secondary" disabled className="w-full bg-white/20 text-white hover:bg-white/30 border-0">Unavailable</Button>
                    </CardContent>
                </Card>
            </div>

            {/* History */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Bell className="h-5 w-5 text-indigo-500" /> Notification History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {user.notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {user.notifications.map((notif: any) => (
                                <div key={notif.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border text-sm">
                                    <div className="mt-0.5">
                                        {notif.type === 'email' ? <Mail className="h-4 w-4 text-sky-500" /> :
                                            notif.type === 'telegram' ? (
                                                <svg className="h-4 w-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.38.12.1.1.13.22.14.31 0 .1-.01.28 0 .28z" />
                                                </svg>
                                            ) :
                                                <Bell className="h-4 w-4 text-slate-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-medium">{notif.message}</p>
                                        <p className="text-slate-400 text-xs mt-1">{new Date(notif.sentAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
