const postgres = require('postgres');

// Create a PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { max: 1 });

async function main() {
  console.log('Pushing schema to database...');
  
  try {
    // Execute all pending migrations
    await sql`
      CREATE TYPE IF NOT EXISTS membership_tier AS ENUM ('free', 'pro');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS visibility AS ENUM ('public', 'private', 'connections');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS message_status AS ENUM ('sent', 'delivered', 'read');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS content_type AS ENUM ('article', 'video', 'image', 'audio');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS account_status AS ENUM ('active', 'suspended', 'banned', 'under_review');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS moderation_reason AS ENUM ('spam', 'inappropriate_content', 'harassment', 'hate_speech', 'violation_of_terms', 'other');
    `;
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT,
        bio TEXT,
        avatar_url TEXT,
        membership_tier membership_tier NOT NULL DEFAULT 'free',
        member_since TIMESTAMP NOT NULL DEFAULT NOW(),
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        reset_password_token TEXT,
        reset_password_expires TIMESTAMP
      );
    `;
    
    // Add missing columns to users table
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[];`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_visibility visibility DEFAULT 'public';`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_image_url TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status account_status DEFAULT 'active';`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS moderation_reason moderation_reason;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS moderation_notes TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS moderated_by INTEGER;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP;`;
      console.log('Added missing columns to users table');
    } catch (err) {
      console.error('Error adding columns to users table:', err);
    }
    
    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        thumbnail TEXT,
        images TEXT[],
        excerpt TEXT NOT NULL,
        category TEXT NOT NULL,
        publish_date TIMESTAMP NOT NULL DEFAULT NOW(),
        membership_required membership_tier NOT NULL DEFAULT 'free'
      );
    `;
    
    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT,
        category TEXT NOT NULL,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE
      );
    `;
    
    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        order_date TIMESTAMP NOT NULL DEFAULT NOW(),
        shipping_address TEXT NOT NULL
      );
    `;
    
    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL
      );
    `;
    
    // Create chat_rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        membership_required membership_tier NOT NULL DEFAULT 'free',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Add missing columns to chat_rooms table
    try {
      await sql`ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS is_moderated BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS is_muted BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS moderator_id INTEGER;`;
      await sql`ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS moderation_notes TEXT;`;
      await sql`ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP;`;
      console.log('Added missing columns to chat_rooms table');
    } catch (err) {
      console.error('Error adding columns to chat_rooms table:', err);
    }
    
    // Create chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        sent_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Add missing columns to chat_messages table
    try {
      await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS hidden_by INTEGER;`;
      await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMP;`;
      await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS hidden_reason moderation_reason;`;
      console.log('Added missing columns to chat_messages table');
    } catch (err) {
      console.error('Error adding columns to chat_messages table:', err);
    }
    
    // Create bulletin_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS bulletin_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        posted_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Add missing columns to bulletin_posts table
    try {
      await sql`ALTER TABLE bulletin_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE bulletin_posts ADD COLUMN IF NOT EXISTS hidden_by INTEGER;`;
      await sql`ALTER TABLE bulletin_posts ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMP;`;
      await sql`ALTER TABLE bulletin_posts ADD COLUMN IF NOT EXISTS hidden_reason moderation_reason;`;
      await sql`ALTER TABLE bulletin_posts ADD COLUMN IF NOT EXISTS moderation_notes TEXT;`;
      console.log('Added missing columns to bulletin_posts table');
    } catch (err) {
      console.error('Error adding columns to bulletin_posts table:', err);
    }
    
    // Create videos table
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT,
        embed_url TEXT,
        image_url TEXT,
        duration TEXT,
        publish_date TIMESTAMP NOT NULL DEFAULT NOW(),
        membership_required membership_tier NOT NULL DEFAULT 'free',
        category TEXT NOT NULL DEFAULT 'general',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        views INTEGER DEFAULT 0,
        external_id TEXT,
        source TEXT NOT NULL DEFAULT 'internal'
      );
    `;
    
    // Create user_favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        video_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Create watch_later table
    await sql`
      CREATE TABLE IF NOT EXISTS watch_later (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        video_id INTEGER NOT NULL,
        added_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Create subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        tier membership_tier NOT NULL,
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        end_date TIMESTAMP,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        auto_renew BOOLEAN NOT NULL DEFAULT TRUE
      );
    `;
    
    // Create admin user
    await sql`
      INSERT INTO users (username, password, email, display_name, bio, membership_tier, is_admin)
      VALUES ('S3vn', '$2b$10$aCMN29PQqGWBSYCgwuIDh.LNtLX6mfoqcLj4wH0Ml1WeoHMIzYtDy', 'admin@s3vnstudies.com', 'S3vn Studies Admin', 'Administrator of S3vn Studies', 'free', TRUE)
      ON CONFLICT (username) DO NOTHING;
    `;
    
    console.log('Schema push completed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();