# WhatsApp Business API Configuration

## Setup Instructions

### 1. Create a Meta Business Account
1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Create or select a business account
3. Navigate to "Settings" → "Business Settings"

### 2. Set Up WhatsApp Business API
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or select existing app
3. Add "WhatsApp" product to your app
4. Follow the setup wizard to:
   - Link your business phone number
   - Verify your business
   - Get API credentials

### 3. Get Your Credentials

#### Phone Number ID
1. In your WhatsApp Business API dashboard
2. Go to "API Setup" or "Getting Started"
3. Copy the "Phone Number ID" (e.g., `102290129340398`)

#### Access Token
1. In your app dashboard, go to "WhatsApp" → "API Setup"
2. Generate a permanent access token:
   - Click "Generate Token"
   - Select required permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
   - Copy the generated token

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=102290129340398
WHATSAPP_ACCESS_TOKEN=EAAViUN16EkoBQOPEmia7qFS2q9E2wpEAGMXTxs0RGSbLOeZBWDfYZAu0xzdpyIOZAcshGYZBVWi9ZCZBP5i7Gk3uJ3eoj1CsoL2MukzJ11LXRccLw54RuLMdkuiE79FXMQITtPZBQC60JD5cuHHKjsSmhWnf0PpYXYzJVZA8UmV8kYJZAV7goTxR1Gl4ZAhWKayUJAkCmPqhNTmvrR6qihSZAHH6nTGzPDDggXuUgdZBliOi
```

### 5. Create Message Templates

WhatsApp requires pre-approved templates for notifications. Create these templates in Meta Business Manager:

#### Template 1: Price Drop Alert
- **Name**: `price_drop_alert`
- **Category**: UTILITY
- **Language**: English
- **Body**:
  ```
  🎉 Price Drop Alert!

  {{product_name}} is now cheaper!
  
  Was: {{old_price}}
  Now: {{new_price}}
  
  Don't miss this deal!
  ```
- **Button**: URL button with dynamic parameter

#### Template 2: Back in Stock
- **Name**: `back_in_stock`
- **Category**: UTILITY  
- **Language**: English
- **Body**:
  ```
  ✅ Back in Stock!

  {{product_name}} is now available again!
  
  Hurry before it sells out!
  ```
- **Button**: URL button with dynamic parameter

### 6. Test Your Integration

1. Add your WhatsApp number in the notifications page
2. Click "Test Message" to verify the connection
3. You should receive a test message on WhatsApp

## Important Notes

### Token Security
- **Never commit** your access token to version control
- Use environment variables for all sensitive data
- Rotate tokens periodically for security

### Rate Limits
- WhatsApp has rate limits based on your tier
- Start with Tier 1: 1,000 conversations/day
- Request higher tiers as your business grows

### Message Costs
- WhatsApp charges for business-initiated conversations
- First 1,000 conversations/month are free
- Check [WhatsApp pricing](https://developers.facebook.com/docs/whatsapp/pricing) for details

### Template Approval
- All message templates must be approved by Meta
- Approval usually takes 1-2 business days
- Follow WhatsApp's template guidelines strictly

## Troubleshooting

### "Access token not configured" Error
- Verify `WHATSAPP_ACCESS_TOKEN` is set in `.env.local`
- Restart your development server after adding env variables

### "Failed to send message" Error
- Check if your phone number is verified in Meta Business
- Ensure templates are approved
- Verify the recipient's phone number format (+country code)

### Template Not Found
- Make sure template names match exactly (case-sensitive)
- Wait for template approval before testing
- Check template status in Meta Business Manager

## API Reference

### Endpoints Used
- **Send Message**: `POST /v18.0/{phone-number-id}/messages`
- **Get Templates**: `GET /v18.0/{business-id}/message_templates`

### Documentation Links
- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)
