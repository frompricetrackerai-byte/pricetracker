
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
                        <form action={async () => { 'use server'; await sendTestNotification('email'); }}>
                            <Button variant={user.emailNotifications ? "secondary" : "outline"} size="sm" className={`w-full ${user.emailNotifications ? 'bg-white/20 text-white hover:bg-white/30 border-0' : 'text-sky-700 hover:text-sky-800 hover:bg-sky-100'}`} disabled={!user.emailNotifications}>
                                Test Email
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Telegram Channel (Premium) */}
                <Card className={`relative overflow-hidden border-0 shadow-lg transition-transform hover:scale-[1.02] ${user.telegramChatId ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white' : 'bg-white border-l-4 border-l-sky-400'}`}>
                    {user.telegramChatId && <div className="absolute top-0 right-0 p-4 opacity-10"><Send className="w-24 h-24 rotate-[-10deg]" /></div>}
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <svg className="h-5 w-5 text-white fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.613 3.525c-1.632.735-8.856 3.737-12.04 5.053-.404.167-.56.287-.58.455-.035.25.326.33.68.428l1.79.56 4.14 4.095c.5.495.426.71.65.65.297-.08.646-.35 1.488-1.16 2.304-2.22 2.65-2.613 2.92-2.613.06 0 .085.02.085.085 0 .034-.02.07-.107.126-1.053.71-4.874 3.32-5.46 3.73-.59.41-1.134.78-1.894.757-.768-.023-2.185-.436-3.235-.776-1.285-.417-2.316-.62-2.213-1.31.053-.35.485-.71 1.285-1.05C18.667 3.67 21.057 2.68 21.613 3.525z" fill="currentColor" stroke="none" />
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
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="white" stroke="none" />
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
