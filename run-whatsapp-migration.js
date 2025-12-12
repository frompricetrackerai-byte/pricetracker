/**
 * Manual migration script to add whatsappPhone field
 * Run this with: node run-whatsapp-migration.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('🔄 Running WhatsApp phone migration...');
        console.log('📊 Database:', process.env.DATABASE_URL?.substring(0, 50) + '...');

        // Add the whatsappPhone column if it doesn't exist
        await pool.query(`
            ALTER TABLE "User" 
            ADD COLUMN IF NOT EXISTS "whatsappPhone" TEXT;
        `);

        console.log('✅ Migration completed successfully!');
        console.log('   Added whatsappPhone column to User table');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
