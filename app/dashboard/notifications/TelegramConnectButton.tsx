'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateTelegramConnectToken, verifyTelegramConnection, unlinkTelegram } from './actions';
import { Send, Check, Loader2, Copy, X } from 'lucide-react';
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
    initialToken: string | null;
}

export function TelegramConnectButton({ isConnected, initialToken }: Props) {
    const [token, setToken] = useState<string | null>(initialToken);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [open, setOpen] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generateTelegramConnectToken();
            if (res.error) {
                toast.error(res.error);
            } else if (res.token) {
                setToken(res.token);
            }
        } catch (e) {
            toast.error("Failed to generate token");
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const res = await verifyTelegramConnection();
            if (res.success) {
                toast.success("Telegram Connected Successfully! 🎉");
                setOpen(false); // Collapse/Close the dialog
            } else if (res.error) {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Verification failed");
        }
        setVerifying(false);
    };

    const handleUnlink = async () => {
        if (!confirm("Are you sure you want to disconnect Telegram?")) return;
        setLoading(true);
        await unlinkTelegram();
        setLoading(false);
        toast.success("Disconnected.");
    };

    // 1. Connected State
    if (isConnected) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Connected to Telegram</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            setTesting(true);
                            try {
                                const { sendTestNotification } = await import('./actions');
                                const res = await sendTestNotification('telegram');
                                if (res.success) {
                                    toast.success('Test message sent! Check your Telegram 📱');
                                } else {
                                    toast.error(res.message || 'Failed to send test message');
                                }
                            } catch (e) {
                                toast.error('Failed to send test message');
                            }
                            setTesting(false);
                        }}
                        disabled={testing}
                        className="flex-1 border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
                    >
                        {testing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
                        Test Message
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUnlink}
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

    // 2. Not Connected - Dialog Flow
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-[#0088cc] hover:bg-[#0077b5]"
                    onClick={() => {
                        if (!token) handleGenerate();
                    }}
                >
                    <Send className="mr-2 h-4 w-4" />
                    Connect Telegram
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-[#0088cc]" /> Connect Telegram
                    </DialogTitle>
                    <DialogDescription>
                        Follow these steps to link your Telegram account for instant alerts.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-[#0088cc]" />
                        </div>
                    ) : token ? (
                        <>
                            <div className="space-y-3">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-blue-900 mb-2">Step 1: Open Telegram</p>
                                    <p className="text-sm text-blue-700">Search for <strong>@MyAIPriceTrackerBot</strong> and start a chat.</p>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-green-900 mb-2">Step 2: Send this code</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <code className="flex-1 bg-white px-4 py-3 rounded border border-green-300 text-lg font-mono font-bold text-green-700 text-center">
                                            {token}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                navigator.clipboard.writeText(token);
                                                toast.success("Code copied!");
                                            }}
                                            className="border-green-300 hover:bg-green-100"
                                        >
                                            <Copy className="h-4 w-4 text-green-700" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-purple-900 mb-2">Step 3: Verify Connection</p>
                                    <p className="text-sm text-purple-700 mb-3">After sending the code to the bot, click below to complete the connection.</p>
                                    <Button
                                        onClick={handleVerify}
                                        disabled={verifying}
                                        className="w-full bg-[#0088cc] hover:bg-[#0077b5]"
                                    >
                                        {verifying ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                                        ) : (
                                            <><Check className="mr-2 h-4 w-4" /> I have sent the code</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            <p>Click "Connect Telegram" to get started</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
