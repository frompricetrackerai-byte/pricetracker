
import axios from 'axios';
import * as cheerio from 'cheerio';

// Global E-commerce Scraper - Vercel Compatible (Cheerio + Axios)
// Updated: 2025-12-09
// Features: JSON-LD, __NEXT_DATA__ (Walmart), OGP/Meta Tags, Stealth Headers

export interface ScrapedProduct {
    title: string;
    price: number;
    currency: string;
    imageUrl: string;
    isAvailable: boolean;
}

// Currency detection by domain
const CURRENCY_MAP: Record<string, string> = {
    'amazon.com': 'USD', 'amazon.co.uk': 'GBP', 'amazon.de': 'EUR', 'amazon.fr': 'EUR',
    'amazon.in': 'INR', 'amazon.ca': 'CAD', 'amazon.com.au': 'AUD', 'amazon.co.jp': 'JPY',
    'walmart.com': 'USD', 'target.com': 'USD', 'bestbuy.com': 'USD',
    'flipkart.com': 'INR', 'myntra.com': 'INR',
    'ebay.com': 'USD', 'ebay.co.uk': 'GBP', 'ebay.de': 'EUR',
    'aliexpress.com': 'USD',
    'etsy.com': 'USD',
    'newegg.com': 'USD',
    'zalando.de': 'EUR', 'zalando.co.uk': 'GBP',
    'asos.com': 'GBP',
    'shopee.sg': 'SGD', 'shopee.com.my': 'MYR',
    'lazada.sg': 'SGD', 'lazada.com.my': 'MYR',
};

function getCurrencyFromUrl(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        for (const [domain, currency] of Object.entries(CURRENCY_MAP)) {
            if (hostname.includes(domain)) return currency;
        }
    } catch (e) { }
    return 'USD'; // Default
}

function detectStore(url: string): string {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('amazon')) return 'amazon';
    if (hostname.includes('flipkart')) return 'flipkart';
    if (hostname.includes('walmart')) return 'walmart';
    if (hostname.includes('ebay')) return 'ebay';
    if (hostname.includes('aliexpress')) return 'aliexpress';
    if (hostname.includes('etsy')) return 'etsy';
    if (hostname.includes('target')) return 'target';
    if (hostname.includes('bestbuy')) return 'bestbuy';
    if (hostname.includes('newegg')) return 'newegg';
    if (hostname.includes('shopee')) return 'shopee';
    if (hostname.includes('lazada')) return 'lazada';
    if (hostname.includes('zalando')) return 'zalando';
    if (hostname.includes('asos')) return 'asos';
    if (hostname.includes('myntra')) return 'myntra';
    return 'generic';
}

function parsePrice(priceText: string | number): number {
    if (typeof priceText === 'number') return priceText;
    const text = String(priceText).trim();
    if (!text) return 0;

    // 0. Cleaned Strict Currency Match (Handles fragmented numbers like "2 4 8" or "$ 2 4 8")
    // Walmart and others sometimes render digits in separate spans or with whitespace
    const cleanText = text.replace(/\s+/g, '');
    const strictMatchClean = cleanText.match(/[\$€£₹¥](\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
    if (strictMatchClean) {
        return parseNumber(strictMatchClean[1]);
    }

    // 1. Strict Currency Match First (e.g., $249.00 or $ 249) - High Confidence
    // Matches $249.00, $ 249, but ignored $24 if it's actually $24V (though $24V is rare, 24V is common)
    const strictMatch = text.match(/[\$€£₹¥]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
    if (strictMatch) {
        return parseNumber(strictMatch[1]);
    }

    // 2. Look for "price" keyword context (e.g. "Price: 249")
    const priceContextMatch = text.match(/price\s*:?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/i);
    if (priceContextMatch) {
        return parseNumber(priceContextMatch[1]);
    }

    // 3. General Number Extraction with Filtering
    // Detect numbers, but IGNORE if followed immediately by units like V, Ah, in, mm, cm, W, V
    // Matches "249" but NOT "24V", "200lm", "1/2"

    // Split by space/special chars to isolate tokens
    // We want to extract the first token that looks like a valid price AND is NOT a spec unit.
    const potentialNumbers = text.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?|\d+)/g);

    if (potentialNumbers) {
        for (const numStr of potentialNumbers) {
            // Check context in the original string
            // Escape dots for regex
            const escapedNum = numStr.replace(/\./g, '\\.');
            const unitCheckRegex = new RegExp(`${escapedNum}\\s*(V|Ah|in|mm|cm|W|lm|kg|g|lb|oz|MHz|Hz|GB|MB|TB)`, 'i');

            if (unitCheckRegex.test(text)) {
                // This number is likely a unit (e.g. 24V), skip it
                continue;
            }

            // Also ignore small integers which might be counts (1, 2) unless they look like money (1.00)
            const val = parseNumber(numStr);
            if (val < 5 && !numStr.includes('.') && !numStr.includes(',')) {
                // Likely a count like "2 batteries", skip lightly unless it's the only option
                continue;
            }

            return val;
        }

        // Fallback: If we skipped everything, return the first one that was > 0
        const firstVal = parseNumber(potentialNumbers[0]);
        if (firstVal > 0) return firstVal;
    }

    return 0;
}

function parseNumber(raw: string): number {
    const cleaned = raw;
    if (cleaned.includes(',') && cleaned.includes('.')) {
        if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
            return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')); // 1.234,56
        } else {
            return parseFloat(cleaned.replace(/,/g, '')); // 1,234.56
        }
    } else if (cleaned.includes(',')) {
        const parts = cleaned.split(',');
        if (parts[parts.length - 1].length === 2) {
            return parseFloat(cleaned.replace(',', '.')); // 12,99
        } else {
            return parseFloat(cleaned.replace(/,/g, '')); // 1,299
        }
    }
    return parseFloat(cleaned);
}

function isValidPriceText(text: string): boolean {
    const t = text.toLowerCase();
    // Reject obvious non-price words
    if (t.includes('%') || t.includes('off') || t.includes('save') || t.includes('discount')) return false;
    if (t.includes('review') || t.includes('rating') || t.includes('star') || t.includes('sold')) return false;
    if (t.includes('return') || t.includes('unavailable') || t.includes('out of stock')) return false;

    // Strict Letter Check: If text contains letters (a-z), it MUST contain a price indicator
    if (/[a-z]/i.test(t)) {
        const hasPriceIndicator = /(rs\.?|inr|usd|eur|gbp|aud|cad|jpy|sgd|myr|price|mrp|amount|curr|only|net|\$|€|£|₹|¥|kr)/i.test(t);
        if (!hasPriceIndicator) return false;
    }

    // Must contain digits
    return /\d/.test(text);
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct | null> {
    try {
        const store = detectStore(url);
        const currency = getCurrencyFromUrl(url);

        // --- Etsy API Integration ---
        if (store === 'etsy') {
            const etsyIdMatch = url.match(/listing\/(\d+)/);
            if (etsyIdMatch) {
                const listingId = etsyIdMatch[1];
                console.log(`✨ Detected Etsy Listing ID: ${listingId}. Attempting API fetch...`);
                const apiResult = await scrapeEtsyAPI(listingId);
                if (apiResult) {
                    console.log('✅ Etsy API Success');
                    return apiResult;
                }
                console.log('⚠️ Etsy API failed or not approved yet, falling back to scraping...');
            }
        }
        // -----------------------------

        console.log(`🛒 Scraping ${store} product (Lightweight), currency: ${currency}`);

        // Fixed User Agent that works for Myntra
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];

        let $;
        let jsonLdResult: any = null;

        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': userAgents[0],
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            });
            $ = cheerio.load(data);

            // RAW DATA EXTRACTION FOR MYNTRA (Bypass Cheerio)
            if (store === 'myntra') {
                // Try match with semicolon anchor first (more precise)
                let match = data.match(/window\.__myx\s*=\s*(\{.*?\});/s);
                if (!match) {
                    // Fallback to greedy match if no semicolon found
                    match = data.match(/window\.__myx\s*=\s*(\{.*\})/s);
                }

                if (match && match[1]) {
                    let jsonStr = match[1].trim();
                    if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

                    // Robust Parse: Trim from end until valid JSON
                    let parsedData = null;
                    let currentStr = jsonStr;

                    try {
                        parsedData = JSON.parse(currentStr);
                    } catch (e) {
                        // Iterative trimming
                        let lastBraceIdx = currentStr.lastIndexOf('}');
                        // Limit attempts to avoid infinite loop
                        let attempts = 0;
                        while (lastBraceIdx > 0 && !parsedData && attempts < 100) {
                            currentStr = currentStr.substring(0, lastBraceIdx + 1);
                            try {
                                parsedData = JSON.parse(currentStr);
                            } catch (err) {
                                lastBraceIdx = currentStr.lastIndexOf('}', lastBraceIdx - 1);
                            }
                            attempts++;
                        }
                    }

                    if (parsedData) {
                        const myxData = parsedData;
                        const pdpData = myxData?.pdpData || myxData?.pdpCore?.pdpData;
                        if (pdpData) {
                            console.log('✅ Found Myntra window.__myx data (Raw)');
                            jsonLdResult = {
                                name: pdpData.name || pdpData.title,
                                image: pdpData.media?.albums?.[0]?.images?.[0]?.src || pdpData.image,
                                offers: { price: pdpData.price?.discounted || pdpData.price?.mrp || pdpData.discountedPrice }
                            };
                            if (pdpData.brand?.name && pdpData.name) {
                                jsonLdResult.name = `${pdpData.brand.name} ${pdpData.name}`;
                            }
                        }
                    } else {
                        console.log('❌ Failed to parse Myntra JSON after trimming');
                    }
                }
            }
        } catch (e: any) {
            console.error('Failed to fetch page:', e.message);

            // IMMEDIATE Fallback to Playwright if 403/429 or strictly Etsy
            if (e.response?.status === 403 || e.response?.status === 429 || url.includes('etsy.com')) {
                console.log('🔄 Switching to Playwright scraping (Heavy Mode)...');
                const pwResult = await scrapeWithPlaywright(url);
                if (pwResult && pwResult.price > 0) return pwResult;

                console.log('🔄 Playwright failed/blocked. Returning null...');
                return null;
            }

            // If main fetch fails, we can still fall through to Jina or return null
            // But we need $ to be defined for the selectors to not crash if they run
            $ = cheerio.load('');
        }

        // Strategy A: JSON-LD Schema.org
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                if (jsonLdResult) return;
                const json = JSON.parse($(el).html() || '{}');

                // Direct Product type
                if (json['@type'] === 'Product') { jsonLdResult = json; return; }

                // Array of objects
                if (Array.isArray(json)) {
                    const product = json.find(item => item['@type'] === 'Product');
                    if (product) { jsonLdResult = product; return; }
                }

                // @graph structure
                if (json['@graph']) {
                    const product = json['@graph'].find((item: any) => item['@type'] === 'Product');
                    if (product) { jsonLdResult = product; return; }
                }

            } catch (e) { }
        });

        // Strategy B: __NEXT_DATA__ (Walmart/Next.js sites)
        if (!jsonLdResult) {
            try {
                const nextDataHtml = $('script#__NEXT_DATA__').html();
                if (nextDataHtml) {
                    const nextData = JSON.parse(nextDataHtml);
                    // Standard Walmart/Next.js structure
                    const initialData = nextData?.props?.pageProps?.initialData || nextData?.props?.pageProps?.data || nextData?.props?.pageProps;

                    // Deep search for product price in typical Walmart/Next paths
                    // Updated path for Walmart: initialData.data.product.priceInfo...
                    const wProduct = initialData?.product || initialData?.data?.product || initialData?.initialResult?.item;
                    const priceInfo = wProduct?.priceInfo || wProduct?.price;

                    if (priceInfo?.currentPrice?.price) {
                        jsonLdResult = {
                            name: wProduct.name || wProduct.name,
                            offers: {
                                price: priceInfo.currentPrice.price,
                                priceCurrency: priceInfo.currentPrice.currency || currency,
                                availability: wProduct.availabilityStatus === 'IN_STOCK' ? 'InStock' : 'OutOfStock'
                            },
                            image: wProduct.imageInfo?.thumbnailUrl || wProduct.imageInfo?.primaryAsset?.url
                        };
                        console.log('✅ Extracted from __NEXT_DATA__');
                    }
                }
            } catch (e) { console.log('Error parsing __NEXT_DATA__', e); }
        }




        if (jsonLdResult) {
            let offer = Array.isArray(jsonLdResult.offers) ? jsonLdResult.offers[0] : jsonLdResult.offers;

            // FIX: If multiple offers exist, sometimes the first one is a monthly installment (low price).
            // We should look for the main price, which is usually higher.
            if (Array.isArray(jsonLdResult.offers) && jsonLdResult.offers.length > 1) {
                // Try to find the highest price offer to avoid installments
                const sortedOffers = [...jsonLdResult.offers].sort((a, b) => {
                    const pA = a.price || a.highPrice || 0;
                    const pB = b.price || b.highPrice || 0;
                    return pB - pA; // Descending
                });
                offer = sortedOffers[0];
            }

            // Check for simple price or high/low price range
            const finalPrice = offer?.price || offer?.highPrice || offer?.lowPrice;

            console.log('DEBUG: jsonLdResult found:', JSON.stringify(jsonLdResult.offers, null, 2));
            console.log('DEBUG: finalPrice Selected:', finalPrice);


            if (finalPrice) {
                const imageUrl = jsonLdResult.image
                    ? (Array.isArray(jsonLdResult.image) ? jsonLdResult.image[0] : jsonLdResult.image)
                    : '';
                const finalImage = typeof imageUrl === 'object' ? imageUrl.url : imageUrl;

                console.log('✅ JSON-LD/__NEXT_DATA__ extraction successful');
                return {
                    title: jsonLdResult.name || 'Unknown Product',
                    price: parsePrice(finalPrice),
                    currency: offer.priceCurrency || currency,
                    imageUrl: finalImage,
                    isAvailable: offer.availability?.includes('InStock') ?? true,
                };
            }
        }


        // 2. Fallback: Universal Meta Tags & Selectors
        const getMeta = (name: string) =>
            $(`meta[property="${name}"]`).attr('content') ||
            $(`meta[name="${name}"]`).attr('content');

        // Universal Price Extraction (OGP/Schema tags)
        const metaPrice = getMeta('product:price:amount') || getMeta('og:price:amount') || getMeta('price');
        let priceText = metaPrice || '';

        if (metaPrice) console.log('✅ Found price in OGP Metadata');

        let title = getMeta('og:title') || $('title').text() || 'Unknown Product';
        let image = getMeta('og:image') || getMeta('twitter:image') || '';
        let isAvailable = true;

        // Store-specific selectors (Only needed if metadata fails)
        const SELECTORS: Record<string, { price: string[], title: string[], image: string[], outOfStock: string[] }> = {
            amazon: {
                price: ['.a-price-whole', '#priceblock_ourprice', '#priceblock_dealprice', '.a-price .a-offscreen', '#corePrice_feature_div .a-price-whole'],
                title: ['#productTitle', '#title'],
                image: ['#landingImage', 'img.a-dynamic-image', '#imgBlkFront'],
                outOfStock: ['#availability .a-color-price', '#outOfStock']
            },
            walmart: {
                price: ['span[itemprop="price"]', 'div[data-testid="price-wrap"] span.f2', 'span.price-characteristic'],
                title: ['h1[itemprop="name"]', 'h1#main-title'],
                image: ['img[data-testid="hero-image"]', 'img.prod-hero-image'],
                outOfStock: ['[data-testid="out-of-stock-msg"]']
            },
            flipkart: {
                price: ['div._30jeq3._16Jk6d', 'div._30jeq3', '._1vC4OE._2rQ-NK'],
                title: ['span.B_NuCI', 'h1._9E25nV'],
                image: ['img._396cs4', 'img._2r_T1I'],
                outOfStock: ['div._16FRp0']
            },
            ebay: {
                price: ['[data-testid="x-price-primary"]', '.x-price-primary', '#prcIsum', '.vi-price'],
                title: ['h1.x-item-title__mainTitle', 'h1[itemprop="name"]'],
                image: ['img#icImg', '.ux-image-magnify__image img'],
                outOfStock: ['.d-quantity__availability']
            },
            aliexpress: {
                price: ['.product-price-value', '[class*="Price"]', '.uniform-banner-box-price'],
                title: ['h1[data-pl="product-title"]', '.product-title-text'],
                image: ['.magnifier-image img', 'img[class*="product"]'],
                outOfStock: []
            },
            etsy: {
                price: ['[data-buy-box-region="price"] p', '.wt-text-title-03'],
                title: ['h1[data-buy-box-listing-title]', 'h1'],
                image: ['img[data-listing-card-listing-image]', '.listing-page-image-carousel img'],
                outOfStock: []
            },
            shopee: {
                price: ['.pqTWkA', '._3n5NQx'],
                title: ['._44qnta', '.qaNIZt'],
                image: ['.jTTPTv img'],
                outOfStock: []
            },
            generic: {
                price: ['[itemprop="price"]', '.price', '#price', '.product-price', '.sale-price'],
                title: ['h1[itemprop="name"]', 'h1.product-title', 'h1'],
                image: ['img[itemprop="image"]', '.product-image img', '#product-image img'],
                outOfStock: ['.out-of-stock', '.sold-out']
            }
        };

        const selectors = SELECTORS[store] || SELECTORS.generic;

        // Extract using selectors
        for (const sel of selectors.title) {
            const el = $(sel);
            if (el.text().trim()) {
                title = el.text().trim();
                break;
            }
        }

        if (!priceText) {
            for (const sel of selectors.price) {
                const el = $(sel);
                const text = el.text().trim() || el.attr('content');
                if (text && isValidPriceText(text)) {
                    priceText = text;
                    break;
                }
            }
        }

        // ... (Selectors extracted) ...

        // CHECK FOR BLOCKING/CAPTCHA BEFORE RETURNING
        const isBlocked = title.toLowerCase().includes('robot') ||
            title.toLowerCase().includes('captcha') ||
            title.toLowerCase().includes('access denied') ||
            title.toLowerCase().includes('forbidden');

        if (isBlocked) {
            console.log('⚠️ Detected CAPTCHA/Block page. Invalidating direct scrape results to force fallback.');
            priceText = '';
            jsonLdResult = null;
        }

        // 3. Jina.ai Reader Fallback (Deep Scraping)
        // If standard extraction failed to find a price, OR if we were blocked, try Jina.ai
        if ((!priceText && !jsonLdResult) || isBlocked) {
            console.log('🚀 Attempting Jina.ai Reader fallback...');
            try {
                const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
                const { data: jinaMarkdown } = await axios.get(jinaUrl, {
                    headers: {
                        'Authorization': 'Bearer jina_api_key_free', // Placeholder, triggers free tier
                        'X-Target-Selector': 'body'
                    },
                    timeout: 25000
                });

                // Parse Markdown for Price
                // Look for patterns like "Price: $12.99" or "$12.99" near keywords
                // exclude /mo or per month
                const priceRegex = /(?:Price|Now|Only)?:?\s*([$€£¥₹]\s*[\d,.]+)(?!\s*\/mo|\s*per month)/i;
                const match = jinaMarkdown.match(priceRegex) ||
                    jinaMarkdown.match(/([$€£¥₹]\s*[\d,.]+)(?!\s*\/mo|\s*per month)/i) ||
                    jinaMarkdown.match(/(\d+[\d,.]*)\s*(USD|EUR|INR)(?!\s*\/mo|\s*per month)/i);

                if (match && match[1]) {
                    priceText = match[1];
                    console.log('✅ Jina.ai found price:', priceText);

                    // Extract Title from first line or # header if we don't have a good one
                    const titleMatch = jinaMarkdown.match(/^#\s+(.+)$/m);
                    if (titleMatch && (!title || isBlocked)) {
                        title = titleMatch[1];
                    }

                    // Try to find main image (markdown image syntax)
                    if (!image) {
                        const imageMatch = jinaMarkdown.match(/!\[.*?\]\((https?:\/\/.*?)\)/);
                        if (imageMatch) image = imageMatch[1];
                    }
                }
            } catch (e) {
                console.error('❌ Jina fallback failed:', (e as any).message);
            }
        }


        // Price parsing logic
        const price = parsePrice(priceText);

        // --- Final Check: If Price is still 0, try Heavy Scraping for specific stores ---
        if ((!price || price === 0) && (store === 'myntra' || store === 'flipkart' || store === 'amazon' || store === 'etsy')) {
            console.log(`⚠️ Price is 0 for ${store} after lightweight scraping. Triggering Heavy Scraping Fallback...`);
            return await scrapeWithPlaywright(url);
        }
        // -------------------------------------------------------------------------------

        return { title, price: price || 0, imageUrl: image, isAvailable, currency };

    } catch (error: any) {
        console.error('❌ Cheerio Scraping failed:', error.message);

        // Fallback to Playwright if 403/429 or strictly Etsy
        if (error.response?.status === 403 || error.response?.status === 429 || url.includes('etsy.com')) {
            console.log('🔄 Switching to Playwright scraping (Heavy Mode)...');
            return await scrapeWithPlaywright(url);
        }

        return null;
    }
}


async function scrapeWithPlaywright(url: string): Promise<ScrapedProduct | null> {
    // Dynamic import to keep main bundle light(er) if possible, and fix ESM require error
    const { chromium } = await import('playwright');
    let browser;
    try {

        browser = await chromium.launch({
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 },
            deviceScaleFactor: 1,
        });
        const page = await context.newPage();

        console.log(`🎭 Playwright navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Special wait for Etsy
        if (url.includes('etsy.com')) {
            try {
                // Wait for the price to appear
                await page.waitForSelector('[data-buy-box-region="price"]', { timeout: 5000 }).catch(() => { });
            } catch (e) { }
        }

        const title = await page.title();

        // Try strict selectors first
        let priceText = '';
        let image = '';
        const currency = getCurrencyFromUrl(url);

        // Etsy Specifics
        if (url.includes('etsy.com')) {
            const priceEl = await page.locator('[data-buy-box-region="price"] p').first();
            if (await priceEl.count() > 0) {
                priceText = await priceEl.innerText();
            } else {
                // Fallback selector
                const secondaryPrice = await page.locator('.wt-text-title-03').first();
                if (await secondaryPrice.count() > 0) {
                    priceText = await secondaryPrice.innerText();
                }
            }

            const imgEl = await page.locator('img[data-listing-card-listing-image]').first();
            if (await imgEl.count() > 0) {
                image = await imgEl.getAttribute('src') || '';
            }
        }

        // Generic Fallback (Regex on Body) if no price found
        if (!priceText) {
            const bodyText = await page.innerText('body');
            const priceMatch = bodyText.match(/[$€£¥₹]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
            if (priceMatch) {
                priceText = priceMatch[0];
            }
        }

        await browser.close();

        return {
            title,
            price: parsePrice(priceText),
            currency,
            imageUrl: image,
            isAvailable: true // Assume available if we found it
        };

    } catch (e) {
        console.error('❌ Playwright failed:', e);
        if (browser) await browser.close();
        return null;
    }
}

// --- Oxylabs Implementation ---
const OXYLABS_USERNAME = process.env.OXYLABS_USERNAME || 'pricetrackerapi_cAr3J';
const OXYLABS_PASSWORD = process.env.OXYLABS_PASSWORD || '1Saran_Madhu_Nuvi';

async function scrapeWithOxylabs(url: string): Promise<ScrapedProduct | null> {
    // Detect country from URL to get correct currency/price
    let geoLocation = 'United States'; // Default
    if (url.includes('/in-en/') || url.includes('.in/') || url.includes('amazon.in') || url.includes('myntra.com') || url.includes('flipkart.com')) {
        geoLocation = 'India';
    } else if (url.includes('/gb/') || url.includes('amazon.co.uk')) {
        geoLocation = 'United Kingdom';
    } else if (url.includes('/ca/') || url.includes('amazon.ca')) {
        geoLocation = 'Canada';
    } else if (url.includes('/de/') || url.includes('amazon.de')) {
        geoLocation = 'Germany';
    }

    const body = {
        source: "universal",
        url: url,
        geo_location: geoLocation,
        parse: true, // Try to let Oxylabs parse key fields
        render: 'html' // Use HTML if parsing fails (fallback content)
    };

    try {
        console.log(`🌐 Calling Oxylabs Realtime API (${geoLocation})...`);
        const { data } = await axios.post('https://realtime.oxylabs.io/v1/queries', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${OXYLABS_USERNAME}:${OXYLABS_PASSWORD}`).toString('base64'),
            },
            timeout: 60000 // 60s timeout for realtime crawler
        });

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const content = result.content; // Content is object if parse:true and supported, string otherwise

            // If Oxylabs parsed it nicely
            if (typeof content === 'object' && content.price) {
                console.log('✅ Oxylabs Parsed Success');
                return {
                    title: content.title || 'Unknown Product',
                    price: typeof content.price === 'number' ? content.price : parsePrice(content.price),
                    currency: content.currency || 'USD', // Often defaults to site currency
                    imageUrl: content.url_image || content.image || '',
                    isAvailable: true
                };
            }

            // Fallback to HTML parsing if they returned raw HTML in content
            if (typeof content === 'string') {
                console.log('✅ Oxylabs HTML Success (Manual Parse)');
                const $ = cheerio.load(content);
                // Reuse some extraction logic or simple regex
                let priceText = '';
                // Etsy specific text search on raw HTML
                if (url.includes('etsy.com')) {
                    // Try extraction
                    const p1 = $('[data-buy-box-region="price"] p').first().text();
                    if (p1) priceText = p1;
                }

                if (!priceText) {
                    // Regex fallback
                    const match = content.match(/[$€£¥₹]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
                    if (match) priceText = match[0];
                }

                if (priceText) {
                    return {
                        title: $('h1').first().text().trim() || 'Scraped Product',
                        price: parsePrice(priceText),
                        currency: getCurrencyFromUrl(url),
                        imageUrl: '',
                        isAvailable: true
                    };
                }
            }
        }
        return null;

    } catch (error: any) {
        console.error('❌ Oxylabs Failed:', error.message);
        return null;
    }
}


// --- Etsy API Implementation ---
const ETSY_API_KEY = '4ygndshim83iewwd3926eaks'; // Provided by User

async function scrapeEtsyAPI(listingId: string): Promise<ScrapedProduct | null> {
    try {
        // 1. Get Listing Details
        // https://developers.etsy.com/documentation/reference/#operation/getListing
        const listingUrl = `https://openapi.etsy.com/v3/application/listings/${listingId}`;
        const { data: listingData } = await axios.get(listingUrl, {
            headers: { 'x-api-key': ETSY_API_KEY }
        });

        // 2. Get Images
        // https://developers.etsy.com/documentation/reference/#operation/getListingImages
        let imageUrl = '';
        try {
            const imagesUrl = `https://openapi.etsy.com/v3/application/listings/${listingId}/images`;
            const { data: imagesData } = await axios.get(imagesUrl, {
                headers: { 'x-api-key': ETSY_API_KEY }
            });
            if (imagesData.results && imagesData.results.length > 0) {
                imageUrl = imagesData.results[0].url_570xN || imagesData.results[0].url_fullxfull;
            }
        } catch (imgError) {
            console.log('⚠️ Failed to fetch Etsy images via API (minor issue)');
        }

        const product = listingData; // v3 usually returns data directly or in results? v3 returns object directly usually.
        // Check structure, v3 response might be wrapped.
        // Usually: { listing_id: ..., title: ..., price: { amount: ..., divisor: ..., currency_code: ... } }

        // Adjust based on actual v3 response structure (based on docs it can be simple object)
        // If it's wrapped in `results` (common in older API), check that.
        const item = product.results ? product.results[0] : product;

        if (!item || !item.price) throw new Error('Invalid API response structure');

        const priceAmount = item.price.amount / item.price.divisor;

        return {
            title: item.title,
            price: priceAmount,
            currency: item.price.currency_code,
            imageUrl: imageUrl || '',
            isAvailable: item.state === 'active'
        };

    } catch (error: any) {
        // Quietly fail so we fall back to scraping
        console.log(`❌ Etsy API Error [${error.response?.status || 'Unknown'}]: ${error.message}`);
        if (error.response?.data) {
            console.log('   API Response:', JSON.stringify(error.response.data));
        }
        return null;
    }
}
