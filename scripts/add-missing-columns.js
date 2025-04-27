import postgres from 'postgres';

// Create a PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { max: 1 });

async function main() {
  console.log('Adding missing columns to tables...');
  
  try {
    // Create new enum types if they don't exist
    try {
      // Check if enum type exists first to avoid errors
      const visibilityExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'visibility'`;
      if (visibilityExists.length === 0) {
        await sql`CREATE TYPE visibility AS ENUM ('public', 'private', 'connections')`;
        console.log('Created visibility enum type');
      }

      const messageStatusExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'message_status'`;
      if (messageStatusExists.length === 0) {
        await sql`CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read')`;
        console.log('Created message_status enum type');
      }

      const contentTypeExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'content_type'`;
      if (contentTypeExists.length === 0) {
        await sql`CREATE TYPE content_type AS ENUM ('article', 'video', 'image', 'audio')`;
        console.log('Created content_type enum type');
      }

      const accountStatusExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'account_status'`;
      if (accountStatusExists.length === 0) {
        await sql`CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned', 'under_review')`;
        console.log('Created account_status enum type');
      }

      const moderationReasonExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'moderation_reason'`;
      if (moderationReasonExists.length === 0) {
        await sql`CREATE TYPE moderation_reason AS ENUM ('spam', 'inappropriate_content', 'harassment', 'hate_speech', 'violation_of_terms', 'other')`;
        console.log('Created moderation_reason enum type');
      }
    } catch (err) {
      console.error('Error creating enum types:', err);
    }
    
    // Add missing columns to users table
    try {
      // Check if column exists before trying to add it
      const checkUserLocationColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'location'
      `;
      
      if (checkUserLocationColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN location TEXT`;
        console.log('Added location column to users table');
      }
      
      const checkUserWebsiteColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'website'
      `;
      
      if (checkUserWebsiteColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN website TEXT`;
        console.log('Added website column to users table');
      }
      
      const checkUserInterestsColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'interests'
      `;
      
      if (checkUserInterestsColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN interests TEXT[]`;
        console.log('Added interests column to users table');
      }
      
      const checkUserProfileVisibilityColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'profile_visibility'
      `;
      
      if (checkUserProfileVisibilityColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN profile_visibility visibility DEFAULT 'public'`;
        console.log('Added profile_visibility column to users table');
      }
      
      const checkUserSocialLinksColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'social_links'
      `;
      
      if (checkUserSocialLinksColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN social_links JSONB`;
        console.log('Added social_links column to users table');
      }
      
      const checkUserCoverImageUrlColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'cover_image_url'
      `;
      
      if (checkUserCoverImageUrlColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN cover_image_url TEXT`;
        console.log('Added cover_image_url column to users table');
      }
      
      const checkUserLastLoginColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_login'
      `;
      
      if (checkUserLastLoginColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN last_login TIMESTAMP`;
        console.log('Added last_login column to users table');
      }
      
      const checkUserAccountStatusColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'account_status'
      `;
      
      if (checkUserAccountStatusColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN account_status account_status DEFAULT 'active'`;
        console.log('Added account_status column to users table');
      }
      
      const checkUserModerationReasonColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'moderation_reason'
      `;
      
      if (checkUserModerationReasonColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN moderation_reason moderation_reason`;
        console.log('Added moderation_reason column to users table');
      }
      
      const checkUserModerationNotesColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'moderation_notes'
      `;
      
      if (checkUserModerationNotesColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN moderation_notes TEXT`;
        console.log('Added moderation_notes column to users table');
      }
      
      const checkUserModeratedByColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'moderated_by'
      `;
      
      if (checkUserModeratedByColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN moderated_by INTEGER`;
        console.log('Added moderated_by column to users table');
      }
      
      const checkUserModeratedAtColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'moderated_at'
      `;
      
      if (checkUserModeratedAtColumn.length === 0) {
        await sql`ALTER TABLE users ADD COLUMN moderated_at TIMESTAMP`;
        console.log('Added moderated_at column to users table');
      }
      
    } catch (err) {
      console.error('Error adding columns to users table:', err);
    }
    
    // Add missing columns to chat_rooms table
    try {
      const checkChatRoomIsModeratedColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_rooms' AND column_name = 'is_moderated'
      `;
      
      if (checkChatRoomIsModeratedColumn.length === 0) {
        await sql`ALTER TABLE chat_rooms ADD COLUMN is_moderated BOOLEAN DEFAULT FALSE`;
        console.log('Added is_moderated column to chat_rooms table');
      }
      
      const checkChatRoomIsMutedColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_rooms' AND column_name = 'is_muted'
      `;
      
      if (checkChatRoomIsMutedColumn.length === 0) {
        await sql`ALTER TABLE chat_rooms ADD COLUMN is_muted BOOLEAN DEFAULT FALSE`;
        console.log('Added is_muted column to chat_rooms table');
      }
      
      const checkChatRoomModeratorIdColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_rooms' AND column_name = 'moderator_id'
      `;
      
      if (checkChatRoomModeratorIdColumn.length === 0) {
        await sql`ALTER TABLE chat_rooms ADD COLUMN moderator_id INTEGER`;
        console.log('Added moderator_id column to chat_rooms table');
      }
      
      const checkChatRoomModerationNotesColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_rooms' AND column_name = 'moderation_notes'
      `;
      
      if (checkChatRoomModerationNotesColumn.length === 0) {
        await sql`ALTER TABLE chat_rooms ADD COLUMN moderation_notes TEXT`;
        console.log('Added moderation_notes column to chat_rooms table');
      }
      
      const checkChatRoomModeratedAtColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_rooms' AND column_name = 'moderated_at'
      `;
      
      if (checkChatRoomModeratedAtColumn.length === 0) {
        await sql`ALTER TABLE chat_rooms ADD COLUMN moderated_at TIMESTAMP`;
        console.log('Added moderated_at column to chat_rooms table');
      }
    } catch (err) {
      console.error('Error adding columns to chat_rooms table:', err);
    }
    
    // Add missing columns to chat_messages table
    try {
      const checkChatMessageIsHiddenColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_messages' AND column_name = 'is_hidden'
      `;
      
      if (checkChatMessageIsHiddenColumn.length === 0) {
        await sql`ALTER TABLE chat_messages ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE`;
        console.log('Added is_hidden column to chat_messages table');
      }
      
      const checkChatMessageHiddenByColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_messages' AND column_name = 'hidden_by'
      `;
      
      if (checkChatMessageHiddenByColumn.length === 0) {
        await sql`ALTER TABLE chat_messages ADD COLUMN hidden_by INTEGER`;
        console.log('Added hidden_by column to chat_messages table');
      }
      
      const checkChatMessageHiddenAtColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_messages' AND column_name = 'hidden_at'
      `;
      
      if (checkChatMessageHiddenAtColumn.length === 0) {
        await sql`ALTER TABLE chat_messages ADD COLUMN hidden_at TIMESTAMP`;
        console.log('Added hidden_at column to chat_messages table');
      }
      
      const checkChatMessageHiddenReasonColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'chat_messages' AND column_name = 'hidden_reason'
      `;
      
      if (checkChatMessageHiddenReasonColumn.length === 0) {
        await sql`ALTER TABLE chat_messages ADD COLUMN hidden_reason moderation_reason`;
        console.log('Added hidden_reason column to chat_messages table');
      }
    } catch (err) {
      console.error('Error adding columns to chat_messages table:', err);
    }
    
    // Add missing columns to bulletin_posts table
    try {
      const checkBulletinPostIsHiddenColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'bulletin_posts' AND column_name = 'is_hidden'
      `;
      
      if (checkBulletinPostIsHiddenColumn.length === 0) {
        await sql`ALTER TABLE bulletin_posts ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE`;
        console.log('Added is_hidden column to bulletin_posts table');
      }
      
      const checkBulletinPostHiddenByColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'bulletin_posts' AND column_name = 'hidden_by'
      `;
      
      if (checkBulletinPostHiddenByColumn.length === 0) {
        await sql`ALTER TABLE bulletin_posts ADD COLUMN hidden_by INTEGER`;
        console.log('Added hidden_by column to bulletin_posts table');
      }
      
      const checkBulletinPostHiddenAtColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'bulletin_posts' AND column_name = 'hidden_at'
      `;
      
      if (checkBulletinPostHiddenAtColumn.length === 0) {
        await sql`ALTER TABLE bulletin_posts ADD COLUMN hidden_at TIMESTAMP`;
        console.log('Added hidden_at column to bulletin_posts table');
      }
      
      const checkBulletinPostHiddenReasonColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'bulletin_posts' AND column_name = 'hidden_reason'
      `;
      
      if (checkBulletinPostHiddenReasonColumn.length === 0) {
        await sql`ALTER TABLE bulletin_posts ADD COLUMN hidden_reason moderation_reason`;
        console.log('Added hidden_reason column to bulletin_posts table');
      }
      
      const checkBulletinPostModerationNotesColumn = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'bulletin_posts' AND column_name = 'moderation_notes'
      `;
      
      if (checkBulletinPostModerationNotesColumn.length === 0) {
        await sql`ALTER TABLE bulletin_posts ADD COLUMN moderation_notes TEXT`;
        console.log('Added moderation_notes column to bulletin_posts table');
      }
    } catch (err) {
      console.error('Error adding columns to bulletin_posts table:', err);
    }
    
    console.log('Successfully added missing columns to the database!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();