# Multi-Currency Support Documentation

## Overview
The Price Tracker AI application now supports automatic currency detection and conversion based on the user's geographic location. Prices are automatically displayed in the user's local currency.

## How It Works

### 1. **Currency Detection**
The system uses a two-tier approach to detect the user's currency:

#### Server-Side Detection (Primary)
- Detects user's country from request headers (Cloudflare, Vercel, or standard geo headers)
- Maps country code to appropriate currency
- More accurate when deployed on platforms like Vercel or Cloudflare

#### Client-Side Detection (Fallback)
- Uses browser's `navigator.language` to detect locale
- Extracts country code from locale (e.g., 'en-US' → 'US')
- Used as fallback if server-side detection fails

### 2. **Supported Currencies**
Currently supported currencies with their conversion rates (relative to INR):

| Currency | Code | Symbol | Conversion Rate | Example Countries |
|----------|------|--------|----------------|-------------------|
| Indian Rupee | INR | ₹ | 1.0 (base) | India |
| US Dollar | USD | $ | 0.012 | United States |
| Euro | EUR | € | 0.011 | Germany, France, Italy, Spain |
| British Pound | GBP | £ | 0.0095 | United Kingdom |
| Australian Dollar | AUD | A$ | 0.018 | Australia |
| Canadian Dollar | CAD | C$ | 0.017 | Canada |

### 3. **Price Conversion**
- Base prices are stored in INR (₹499 for Premium, ₹999 original price)
- Prices are converted to user's currency using the conversion rates
- Conversion formula: `Local Price = INR Price × Conversion Rate`
- Prices are rounded appropriately:
  - INR: Rounded to nearest whole number
  - Other currencies: Rounded to 2 decimal places

### 4. **Implementation Files**

#### Core Utilities
- **`lib/utils/currency.ts`**: Currency configuration, conversion, and formatting
- **`lib/utils/geolocation.ts`**: Server-side country/currency detection

#### Components
- **`components/subscription/BillingCards.tsx`**: Client component that displays pricing
- **`app/dashboard/billing/page.tsx`**: Server component that detects currency

## Usage Examples

### Adding a New Currency
To add support for a new currency, update `lib/utils/currency.ts`:

```typescript
export const CURRENCIES: Record<string, CurrencyConfig> = {
    // ... existing currencies
    JPY: {
        code: 'JPY',
        symbol: '¥',
        locale: 'ja-JP',
        conversionRate: 1.8, // 1 INR ≈ 1.8 JPY
    },
};

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
    // ... existing mappings
    JP: 'JPY',
};
```

### Using Currency Utilities in Code

```typescript
import { getCurrencySymbol, convertPrice, formatPrice } from '@/lib/utils/currency';

// Get currency symbol
const symbol = getCurrencySymbol('USD'); // Returns: '$'

// Convert price from INR to USD
const usdPrice = convertPrice(499, 'USD'); // Returns: 5.99

// Format price with symbol and locale
const formatted = formatPrice(499, 'USD'); // Returns: '$5.99'
```

### Detecting User Currency

```typescript
// Server-side (in Server Components or API Routes)
import { detectUserCurrencyServer } from '@/lib/utils/geolocation';

const currency = await detectUserCurrencyServer(); // Returns: 'USD', 'INR', etc.

// Client-side (in Client Components)
import { detectUserCurrency } from '@/lib/utils/currency';

const currency = detectUserCurrency(); // Returns: 'USD', 'INR', etc.
```

## Testing

### Local Testing
When testing locally, the system will default to INR since localhost doesn't provide geo headers. To test different currencies:

1. **Use Browser DevTools**: Change browser language settings
2. **Deploy to Vercel/Cloudflare**: These platforms provide geo headers
3. **Use VPN**: Connect through different countries

### Updating Conversion Rates
Conversion rates are hardcoded in `lib/utils/currency.ts`. To update them:

1. Check current exchange rates
2. Update the `conversionRate` values
3. Rebuild the application

## Important Notes

1. **Payment Processing**: While prices are displayed in local currency, payment is still processed in INR. This is noted in the UI for non-Indian users.

2. **Accuracy**: Conversion rates are approximate and should be updated periodically to reflect current exchange rates.

3. **Fallback**: The system always falls back to INR if currency detection fails.

4. **Performance**: Currency detection happens server-side for better performance and accuracy.

## Future Enhancements

Potential improvements for the currency system:

1. **Dynamic Exchange Rates**: Integrate with a currency API for real-time rates
2. **User Preference**: Allow users to manually select their preferred currency
3. **Multi-Currency Payments**: Support actual payment processing in different currencies
4. **More Currencies**: Add support for more global currencies
5. **Currency in Database**: Store user's preferred currency in the database
