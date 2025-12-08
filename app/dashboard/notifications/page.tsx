
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Phone, Sparkles, Crown, Lock, Send, Check, AlertCircle } from 'lucide-react';
import { toggleNotification, sendTestNotification, generateTelegramConnectToken, verifyTelegramConnection, unlinkTelegram } from './actions';
import ContactDetails from './ContactDetails';
import Link from 'next/link';
import { TelegramConnectButton } from './TelegramConnectButton'; // We will create this client component for interactivity

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
                        <Sparkles className="h-5 w-5 text-blue-500" />
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
                <Card className={`relative overflow-hidden border-0 shadow-lg transition-transform hover:scale-[1.02] ${user.emailNotifications ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' : 'bg-white'}`}>
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
                        <form action={async () => { 'use server'; await sendTestNotification('email'); }}>
                            <Button variant={user.emailNotifications ? "secondary" : "outline"} size="sm" className={`w-full ${user.emailNotifications ? 'bg-white/20 text-white hover:bg-white/30 border-0' : 'text-sky-700 hover:text-sky-800 hover:bg-sky-100'}`} disabled={!user.emailNotifications}>
                                Test Email
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Telegram Channel (Premium) */}
                <Card className={`relative overflow-hidden border-0 shadow-lg transition-transform hover:scale-[1.02] ${user.telegramChatId ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-white border-l-4 border-l-blue-400'}`}>
                    {user.telegramChatId && <div className="absolute top-0 right-0 p-4 opacity-10"><Send className="w-24 h-24" /></div>}
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Send className={`h-5 w-5 ${user.telegramChatId ? 'text-white' : 'text-[#0088cc]'}`} /> Telegram
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
                <Card className="shadow-sm border-dashed opacity-70">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                                    <MessageSquare className="h-5 w-5" /> WhatsApp
                                </CardTitle>
                                <CardDescription>Coming Soon</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="ghost" disabled className="w-full">Unavailable</Button>
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
                                            notif.type === 'telegram' ? <Send className="h-4 w-4 text-blue-500" /> :
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
