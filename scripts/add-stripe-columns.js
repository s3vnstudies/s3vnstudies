/**
 * This script adds Stripe customer and subscription fields to the users table
 */
import pg from 'pg';
const { Pool } = pg;

async function main() {
  try {
    console.log("Adding Stripe columns to users table...");
    
    // Create a database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Add Stripe columns to users table if they don't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
      ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
      ADD COLUMN IF NOT EXISTS subscription_status TEXT;
    `);

    console.log("Stripe columns added successfully!");
    await pool.end();
  } catch (error) {
    console.error("Error adding Stripe columns:", error);
    process.exit(1);
  }
}

main();