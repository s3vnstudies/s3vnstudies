import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const membershipTierEnum = pgEnum("membership_tier", ["free", "pro"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private", "connections"]);
export const messageStatusEnum = pgEnum("message_status", ["sent", "delivered", "read"]);
export const userContentTypeEnum = pgEnum("content_type", ["article", "video", "image", "audio"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  membershipTier: membershipTierEnum("membership_tier").default("free").notNull(),
  memberSince: timestamp("member_since").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  // New profile fields
  location: text("location"),
  website: text("website"),
  interests: text("interests").array(),
  profileVisibility: visibilityEnum("profile_visibility").default("public").notNull(),
  socialLinks: jsonb("social_links"), // JSON object for social media links
  coverImageUrl: text("cover_image_url"),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    displayName: true,
  })
  .extend({
    email: z.string().email(),
    displayName: z.string().min(1).max(50).optional(),
  });

// For extended profile update operations
export const updateProfileSchema = createInsertSchema(users)
  .pick({
    displayName: true,
    bio: true,
    avatarUrl: true,
    location: true,
    website: true,
    interests: true,
    profileVisibility: true,
    socialLinks: true,
    coverImageUrl: true,
  })
  .partial();

// User connections (friends/followers)
export const userConnections = pgTable("user_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // The user who initiated the connection
  connectedUserId: integer("connected_user_id").notNull(), // The user being connected to
  status: text("status").notNull(), // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserConnectionSchema = createInsertSchema(userConnections)
  .pick({
    userId: true,
    connectedUserId: true,
    status: true,
  });

// Private messages between users
export const privateMessages = pgTable("private_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  recipientId: integer("recipient_id").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  status: messageStatusEnum("status").default("sent").notNull(),
});

export const insertPrivateMessageSchema = createInsertSchema(privateMessages)
  .pick({
    senderId: true,
    recipientId: true,
    content: true,
  });

// User created content
export const userContent = pgTable("user_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: userContentTypeEnum("content_type").notNull(),
  contentUrl: text("content_url").notNull(), // URL to the content file
  thumbnailUrl: text("thumbnail_url"),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  metadata: jsonb("metadata"), // Additional metadata for the content
});

export const insertUserContentSchema = createInsertSchema(userContent)
  .pick({
    userId: true,
    title: true,
    description: true,
    contentType: true,
    contentUrl: true,
    thumbnailUrl: true,
    visibility: true,
    metadata: true,
  });

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  thumbnail: text("thumbnail"),
  images: text("images").array(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  membershipRequired: membershipTierEnum("membership_required").default("free").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  content: true,
  author: true,
  thumbnail: true,
  images: true,
  excerpt: true,
  category: true,
  membershipRequired: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  inStock: true,
  isFeatured: true,
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalAmount: integer("total_amount").notNull(), // stored in cents
  status: text("status").notNull(), // pending, completed, cancelled
  orderDate: timestamp("order_date").defaultNow().notNull(),
  shippingAddress: text("shipping_address").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  totalAmount: true,
  status: true,
  shippingAddress: true,
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // stored in cents
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull(), // user id
  isPrivate: boolean("is_private").default(false).notNull(),
  membershipRequired: membershipTierEnum("membership_required").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).pick({
  name: true,
  description: true,
  createdBy: true,
  isPrivate: true,
  membershipRequired: true,
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  roomId: true,
  userId: true,
  message: true,
});

export const bulletinPosts = pgTable("bulletin_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
});

export const insertBulletinPostSchema = createInsertSchema(bulletinPosts).pick({
  title: true,
  content: true,
  userId: true,
  category: true,
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),  // Full URL to the video
  embedUrl: text("embed_url"),  // URL for embedding the video
  imageUrl: text("image_url"),  // Thumbnail image URL
  duration: text("duration"),   // Video duration
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  membershipRequired: membershipTierEnum("membership_required").default("free").notNull(),
  category: text("category").default("general").notNull(),
  featured: boolean("featured").default(false).notNull(),
  views: integer("views").default(0),
  externalId: text("external_id"),  // YouTube video ID or other external ID
  source: text("source").default("internal").notNull(),  // 'youtube' or 'internal'
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  videoUrl: true,
  embedUrl: true,
  imageUrl: true,
  duration: true,
  publishDate: true,
  membershipRequired: true,
  category: true,
  featured: true,
  views: true,
  externalId: true,
  source: true,
});

// User favorites for videos
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).pick({
  userId: true,
  videoId: true,
});

// Watch later list for videos
export const watchLater = pgTable("watch_later", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const insertWatchLaterSchema = createInsertSchema(watchLater).pick({
  userId: true,
  videoId: true,
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tier: membershipTierEnum("tier").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  active: boolean("active").default(true).notNull(),
  autoRenew: boolean("auto_renew").default(true).notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  tier: true,
  endDate: true,
  active: true,
  autoRenew: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type BulletinPost = typeof bulletinPosts.$inferSelect;
export type InsertBulletinPost = z.infer<typeof insertBulletinPostSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type WatchLater = typeof watchLater.$inferSelect;
export type InsertWatchLater = z.infer<typeof insertWatchLaterSchema>;

// New types for user profile features
export type UserConnection = typeof userConnections.$inferSelect;
export type InsertUserConnection = z.infer<typeof insertUserConnectionSchema>;

export type PrivateMessage = typeof privateMessages.$inferSelect;
export type InsertPrivateMessage = z.infer<typeof insertPrivateMessageSchema>;

export type UserContent = typeof userContent.$inferSelect;
export type InsertUserContent = z.infer<typeof insertUserContentSchema>;
