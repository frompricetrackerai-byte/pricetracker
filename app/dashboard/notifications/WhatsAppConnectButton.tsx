'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateWhatsAppPhone, sendTestWhatsAppNotification, disconnectWhatsApp } from '../notifications/whatsappActions';
import { MessageCircle, Check, Loader2, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
    isConnected: boolean;
    initialPhone: string | null;
}

export function WhatsAppConnectButton({ isConnected, initialPhone }: Props) {
    const [phone, setPhone] = useState(initialPhone || '');
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleConnect = async () => {
        if (!phone || phone.trim().length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const res = await updateWhatsAppPhone(phone);
            if (res.success) {
                toast.success('WhatsApp number saved! 🎉');
                setOpen(false);
            } else {
                toast.error(res.error || 'Failed to save phone number');
            }
        } catch (e) {
            toast.error('Failed to save phone number');
        }
        setLoading(false);
    };

    const handleTest = async () => {
        setTesting(true);
        try {
            const res = await sendTestWhatsAppNotification();
            if (res.success) {
                toast.success('Test message sent! Check your WhatsApp 📱');
            } else {
                toast.error(res.error || 'Failed to send test message');
            }
        } catch (e) {
            toast.error('Failed to send test message');
        }
        setTesting(false);
    };

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect WhatsApp?')) return;
        setLoading(true);
        try {
            await disconnectWhatsApp();
            setPhone('');
            toast.success('WhatsApp disconnected');
        } catch (e) {
            toast.error('Failed to disconnect');
        }
        setLoading(false);
    };

    // Connected State
    if (isConnected && initialPhone) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Connected: {initialPhone}</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTest}
                        disabled={testing}
                        className="flex-1 border-green-300 hover:bg-green-50 text-green-700 hover:text-green-800"
                    >
                        {testing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
                        Test Message
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <X className="h-3 w-3 mr-2" />}
                        Disconnect
                    </Button>
                </div>
            </div>
        );
    }

    // Not Connected - Dialog Flow
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A]">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Connect WhatsApp
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                        Connect WhatsApp
                    </DialogTitle>
                    <DialogDescription>
                        Enter your WhatsApp number to receive instant price alerts.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-phone">WhatsApp Phone Number</Label>
                        <Input
                            id="whatsapp-phone"
                            type="tel"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                            Include country code (e.g., +91 for India, +1 for USA)
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        <p className="font-medium text-blue-900 mb-1">📱 Important Notes:</p>
                        <ul className="text-blue-700 space-y-1 text-xs ml-4 list-disc">
                            <li>Make sure this number has WhatsApp installed</li>
                            <li>You'll receive notifications from our business account</li>
                            <li>No need to save our number - we'll message you first</li>
                        </ul>
                    </div>

                    <Button
                        onClick={handleConnect}
                        disabled={loading || !phone}
                        className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Check className="mr-2 h-4 w-4" /> Save WhatsApp Number</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
