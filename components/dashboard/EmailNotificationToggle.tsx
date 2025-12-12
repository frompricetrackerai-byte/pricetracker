"use client";

import { Switch } from "@/components/ui/switch";
import { toggleNotification } from "@/app/dashboard/notifications/actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EmailNotificationToggleProps {
    initialEnabled: boolean;
}

export function EmailNotificationToggle({ initialEnabled }: EmailNotificationToggleProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        const newState = !enabled;
        console.log('🔔 Toggle clicked:', { from: enabled, to: newState });

        setEnabled(newState);
        setIsLoading(true);

        try {
            console.log('📤 Calling toggleNotification with:', newState);
            const result = await toggleNotification('email', newState);
            console.log('✅ Toggle result:', result);

            toast.success(newState ? "Email notifications enabled ✅" : "Email notifications disabled ❌");

            // Force refresh
            router.refresh();
        } catch (error) {
            console.error('❌ Toggle error:', error);
            // Revert on error
            setEnabled(!newState);
            toast.error("Failed to update notification settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
                backgroundColor: enabled ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                border: enabled ? '1px solid white' : '1px solid #d1d5db'
            }}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}
