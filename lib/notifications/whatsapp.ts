/**
 * WhatsApp Business API Integration
 * Uses Meta's WhatsApp Business Platform to send notifications
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '102290129340398';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export interface WhatsAppMessage {
    to: string; // Phone number with country code (e.g., +919876543210)
    type: 'template' | 'text';
    template?: {
        name: string;
        language: { code: string };
        components?: any[];
    };
    text?: {
        body: string;
    };
}

/**
 * Send a WhatsApp message using Meta's Business API
 */
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<boolean> {
    if (!ACCESS_TOKEN) {
        console.error('[WhatsApp] Access token not configured');
        return false;
    }

    try {
        const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

        const payload: any = {
            messaging_product: 'whatsapp',
            to: message.to.replace(/[^0-9]/g, ''), // Remove non-numeric characters
            type: message.type,
        };

        if (message.type === 'template' && message.template) {
            payload.template = message.template;
        } else if (message.type === 'text' && message.text) {
            payload.text = message.text;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[WhatsApp] API Error:', data);
            return false;
        }

        console.log('[WhatsApp] Message sent successfully:', data);
        return true;
    } catch (error) {
        console.error('[WhatsApp] Failed to send message:', error);
        return false;
    }
}

/**
 * Send a price drop notification via WhatsApp template
 */
export async function sendPriceDropWhatsApp(
    phoneNumber: string,
    productName: string,
    oldPrice: string,
    newPrice: string,
    productUrl: string
): Promise<boolean> {
    // Using a template message (you'll need to create this template in Meta Business Manager)
    return sendWhatsAppMessage({
        to: phoneNumber,
        type: 'template',
        template: {
            name: 'price_drop_alert', // Template name in Meta Business Manager
            language: { code: 'en' },
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: productName },
                        { type: 'text', text: oldPrice },
                        { type: 'text', text: newPrice },
                    ],
                },
                {
                    type: 'button',
                    sub_type: 'url',
                    index: 0,
                    parameters: [
                        { type: 'text', text: productUrl },
                    ],
                },
            ],
        },
    });
}

/**
 * Send a back-in-stock notification via WhatsApp
 */
export async function sendBackInStockWhatsApp(
    phoneNumber: string,
    productName: string,
    productUrl: string
): Promise<boolean> {
    return sendWhatsAppMessage({
        to: phoneNumber,
        type: 'template',
        template: {
            name: 'back_in_stock', // Template name in Meta Business Manager
            language: { code: 'en' },
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: productName },
                    ],
                },
                {
                    type: 'button',
                    sub_type: 'url',
                    index: 0,
                    parameters: [
                        { type: 'text', text: productUrl },
                    ],
                },
            ],
        },
    });
}

/**
 * Send a test WhatsApp message
 */
export async function sendTestWhatsApp(phoneNumber: string): Promise<boolean> {
    // For testing, we can use a simple text message if templates aren't set up yet
    return sendWhatsAppMessage({
        to: phoneNumber,
        type: 'text',
        text: {
            body: '✅ Test notification from Price Tracker AI! Your WhatsApp notifications are working correctly.',
        },
    });
}

/**
 * Validate WhatsApp phone number format
 */
export function validateWhatsAppPhone(phone: string): boolean {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/[^0-9]/g, '');

    // Should be between 10-15 digits (with country code)
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Format phone number for WhatsApp (add country code if missing)
 */
export function formatWhatsAppPhone(phone: string, defaultCountryCode: string = '91'): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/[^0-9]/g, '');

    // If doesn't start with country code, add default (India: 91)
    if (!cleaned.startsWith(defaultCountryCode) && cleaned.length === 10) {
        cleaned = defaultCountryCode + cleaned;
    }

    return '+' + cleaned;
}
