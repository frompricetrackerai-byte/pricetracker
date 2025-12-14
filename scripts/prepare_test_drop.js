/**
 * Prepare Test Drop Script
 * 
 * 1. Finds the first product in the DB.
 * 2. Updates its `currentPrice` to a very high value (1,000,000).
 * 3. Sets `nextCheckAt` to the past to ensure immediate pickup.
 * 4. Prints instructions.
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('🔄 Preparing test price drop...');

        // 1. Get a product
        const res = await pool.query(`
            SELECT id, title, "currentPrice", url, "userId" 
            FROM "Product" 
            WHERE "alertEnabled" = true 
            LIMIT 1
        `);

        if (res.rows.length === 0) {
            console.error('❌ No products found with alerts enabled.');
            process.exit(1);
        }

        const product = res.rows[0];
        console.log(`Found product: ${product.title} (ID: ${product.id})`);
        console.log(`Current Price: ${product.currentPrice}`);

        // 2. Update to high price
        const highPrice = 999999;
        await pool.query(`
            UPDATE "Product"
            SET "currentPrice" = $1, 
                "nextCheckAt" = NOW() - INTERVAL '1 hour',
                "lastCheckedAt" = NOW() - INTERVAL '1 hour'
            WHERE id = $2
        `, [highPrice, product.id]);

        console.log(`✅ Updated price to ${highPrice} and reset check time.`);
        console.log(`🚀 Now trigger the price check API to see the alert!`);
        console.log(`   URL: ${product.url}`);

        // Optional: Check if user has telegram/whatsapp set up
        const userRes = await pool.query('SELECT "telegramChatId", "whatsappPhone", "subscriptionTier" FROM "User" WHERE id = $1', [product.userId]);
        const user = userRes.rows[0];
        console.log('User Config:');
        console.log(`- Telegram: ${user.telegramChatId ? '✅ Configured' : '❌ Missing'}`);
        console.log(`- WhatsApp: ${user.whatsappPhone ? '✅ Configured' : '❌ Missing'} (Tier: ${user.subscriptionTier})`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

main();
