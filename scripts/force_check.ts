/**
 * Force Price Check
 * 
 * Imports the checkPrices function directly and runs it.
 * This bypasses the need for the Next.js server to be running.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { prisma } from '../lib/db/prisma';
import { scrapeProduct } from '../lib/scraping/playwright-scraper';
import nodemailer from 'nodemailer';
import { sendTelegramMessage } from '../lib/telegram/client';
import { sendPriceDropWhatsApp } from '../lib/notifications/whatsapp';

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_EMAIL || process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
});

async function forceCheck() {
    console.log('🚀 Forcing Price Check (Direct Script Mode - ESM)...');

    const now = new Date();

    // Find products due for check (OR force all active ones)
    // Let's force check ALL active products for this test to be sure
    const products = await prisma.product.findMany({
        where: {
            isAvailable: true // Just check available ones
        },
        include: { user: true }
    });

    console.log(`Checking ${products.length} products...`);

    for (const product of products) {
        console.log(`\n🔎 Checking: ${product.title}`);
        try {
            const scrapedData = await scrapeProduct(product.url);

            if (scrapedData) {
                console.log(`   Scraped Price: ${scrapedData.price}`);
                const oldPrice = Number(product.currentPrice);
                const newPrice = scrapedData.price;
                console.log(`   DB Price: ${oldPrice}`);

                // Update product
                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        title: scrapedData.title || product.title,
                        imageUrl: scrapedData.imageUrl || product.imageUrl,
                        currentPrice: newPrice,
                        isAvailable: scrapedData.isAvailable,
                        lastCheckedAt: now,
                        nextCheckAt: new Date(now.getTime() + product.checkInterval * 1000),
                        priceHistory: {
                            create: {
                                price: newPrice,
                                isAvailable: scrapedData.isAvailable
                            }
                        }
                    }
                });

                // Check alerts
                const isPriceDrop = newPrice < oldPrice;
                const matchesTarget = product.alertThreshold ? newPrice <= Number(product.alertThreshold) : false;

                if (product.alertEnabled && isPriceDrop && (product.notifyAnyDrop || matchesTarget)) {
                    // Force debug log:
                    console.log(`   🚨 [LOGIC] Drop Detected: ${newPrice} < ${oldPrice}`);

                    const message = `Price dropped for ${product.title} from ₹${oldPrice} to ₹${newPrice}`;
                    console.log(`   🚨 PRICE DROP DETECTED! Sending alerts...`);

                    // 1. Email Notification
                    if (product.user.emailNotifications && product.user.email) {
                        try {
                            await transporter.sendMail({
                                from: process.env.SMTP_EMAIL || process.env.SMTP_FROM,
                                to: product.user.email,
                                subject: `Price Drop Alert: ${product.title}`,
                                html: `<h1>Price Drop!</h1><p>Old: ₹${oldPrice}</p><p>New: <strong>₹${newPrice}</strong></p>`
                            });
                            console.log(`   ✅ Email sent to ${product.user.email}`);
                        } catch (e: any) {
                            console.error('   ❌ Failed to send email:', e.message);
                        }
                    }

                    // 2. Telegram Notification
                    if (product.user.telegramChatId) {
                        try {
                            const telegramMessage = `📉 *Price Drop Alert!*\n\n*${product.title}*\n\nOld Price: ₹${oldPrice}\nNew Price: *₹${newPrice}*\n\n[View Product](${product.url})`;
                            await sendTelegramMessage(telegramMessage, product.user.telegramChatId);
                            console.log(`   ✅ Telegram sent to ${product.user.telegramChatId}`);
                        } catch (e: any) {
                            console.error('   ❌ Failed to send Telegram:', e.message);
                        }
                    }

                    // 3. WhatsApp Notification
                    if (product.user.whatsappNotifications && product.user.whatsappPhone) {
                        try {
                            await sendPriceDropWhatsApp(
                                product.user.whatsappPhone,
                                product.title || 'Product',
                                `₹${oldPrice}`,
                                `₹${newPrice}`,
                                product.url
                            );
                            console.log(`   ✅ WhatsApp sent to ${product.user.whatsappPhone}`);
                        } catch (e: any) {
                            console.error('   ❌ Failed to send WhatsApp:', e.message);
                        }
                    }
                } else {
                    console.log(`   No alert triggered. (Drop: ${isPriceDrop})`);
                }

            } else {
                console.log(`   ⚠️ Failed to scrape data (null result).`);
            }
        } catch (err: any) {
            console.error(`   ❌ Error checking product:`, err.message);
        }
    }
}

forceCheck();
