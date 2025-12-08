"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendTestNotification } from "@/app/dashboard/notifications/actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface TestEmailButtonProps {
    emailNotificationsEnabled: boolean;
}

export function TestEmailButton({ emailNotificationsEnabled }: TestEmailButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSendTest = async () => {
        if (!emailNotificationsEnabled) return;

        setIsLoading(true);
        try {
            await sendTestNotification('email');
            toast.success("Test email sent successfully! 📧");
        } catch (error) {
            toast.error("Failed to send test email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={emailNotificationsEnabled ? "secondary" : "outline"}
            size="sm"
            className={`w-full ${emailNotificationsEnabled ? 'bg-white/20 text-white hover:bg-white/30 border-0' : 'text-sky-700 hover:text-sky-800 hover:bg-sky-100'}`}
            disabled={!emailNotificationsEnabled || isLoading}
            onClick={handleSendTest}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? 'Sending...' : 'Test Email'}
        </Button>
    );
}
