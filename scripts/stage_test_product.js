/**
 * Create/Reset Test Product for Price Drop
 * 
 * 1. Finds the first user.
 * 2. Creates or Updates a test product with a known URL.
 * 3. Sets the DB price to 10x normal to guarantee a drop.
 * 4. Resets check timers.
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('🔄 Setting up test product...');

        // 1. Get User
        const userRes = await pool.query('SELECT id, email, "telegramChatId", "whatsappPhone" FROM "User" LIMIT 1');
        if (userRes.rows.length === 0) {
            console.error('❌ No user found.');
            process.exit(1);
        }
        const user = userRes.rows[0];
        console.log(`👤 User: ${user.email} (ID: ${user.id})`);

        // 2. Define Test Product
        const testUrl = 'https://www.etsy.com/in-en/listing/1589680975/crochet-pattern-granny-square-poncho?ls=a&external=1&rec_type=ad&ref=landingpage_similar_listing_top-2&pro=1&sts=1&dd=1&plkey=LT7f069792c26ef3ecfd54caad6751dd2ee7279b0b%3A1589680975';
        const highPrice = 5000;

        // Check if exists
        const existingRes = await pool.query('SELECT id FROM "Product" WHERE "userId" = $1 AND url = $2', [user.id, testUrl]);

        if (existingRes.rows.length > 0) {
            // Update
            const prodId = existingRes.rows[0].id;
            console.log(`📝 Updating existing product (ID: ${prodId})...`);
            await pool.query(`
                UPDATE "Product" 
                SET "currentPrice" = $1,
                    "alertEnabled" = true,
                    "notifyAnyDrop" = true,
                    "nextCheckAt" = NOW() - INTERVAL '1 minute'
                WHERE id = $2
            `, [highPrice, prodId]);
            console.log(`✅ Updated existing product.`);
        } else {
            console.log(`🆕 Creating new test product...`);
            // Insert new
            const randomId = 'test_' + Math.random().toString(36).substring(7);
            const insertQuery = `
                INSERT INTO "Product" (
                    id, "userId", url, title, "currentPrice", "initialPrice", 
                    "alertEnabled", "notifyAnyDrop", "isAvailable", 
                    "checkInterval", "updatedAt", "nextCheckAt", 
                    "currency"
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, 
                    true, true, true, 
                    3600, NOW(), NOW() - INTERVAL '1 minute',
                    'INR'
                )
            `;

            await pool.query(insertQuery, [
                randomId,
                user.id,
                testUrl,
                'Test Product (Crochet Pattern)',
                highPrice,
                highPrice
            ]);
            console.log(`✅ Created NEW test product with ID: ${randomId}`);
        }

        console.log(`✅ Test Product Set Up!`);
        console.log(`   Price set to: ${highPrice} (Expect drop to actual price)`);
        console.log(`   Alerts Enabled: YES`);
        console.log(`   Next Check: IMMEDIATE`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

main();
