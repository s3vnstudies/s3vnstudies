import { pgTable, text, serial, integer, boolean, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User related schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  role: text("role").default("user").notNull(),
  membershipTier: text("membership_tier").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Content related schemas
export const contentTypeEnum = pgEnum("content_type", ["article", "video", "workshop"]);

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  contentType: contentTypeEnum("content_type").notNull(),
  thumbnail: text("thumbnail"),
  authorId: integer("author_id").notNull(),
  published: boolean("published").default(true).notNull(),
  premium: boolean("premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contents).pick({
  title: true,
  description: true,
  content: true,
  contentType: true,
  thumbnail: true,
  authorId: true,
  published: true,
  premium: true,
});

// Product related schemas
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  image: text("image").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").default(0).notNull(),
  isNew: boolean("is_new").default(false),
  onSale: boolean("on_sale").default(false),
  originalPrice: integer("original_price"), // in cents, for sale items
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  image: true,
  category: true,
  stock: true,
  isNew: true,
  onSale: true,
  originalPrice: true,
});

// Chat room related schemas
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).pick({
  name: true,
  description: true,
  createdBy: true,
  isPrivate: true,
});

// Chat message related schemas
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  roomId: true,
  userId: true,
  message: true,
});

// Bulletin board related schemas
export const bulletinPosts = pgTable("bulletin_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBulletinPostSchema = createInsertSchema(bulletinPosts).pick({
  title: true,
  content: true,
  userId: true,
  pinned: true,
});

// Order related schemas
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").default("pending").notNull(),
  total: integer("total").notNull(), // in cents
  items: jsonb("items").notNull(),
  shippingAddress: jsonb("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  total: true,
  items: true,
  shippingAddress: true,
});

// Membership subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  tier: text("tier").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("active").notNull(),
  autoRenew: boolean("auto_renew").default(true).notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  tier: true,
  startDate: true,
  endDate: true,
  status: true,
  autoRenew: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Content = typeof contents.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type BulletinPost = typeof bulletinPosts.$inferSelect;
export type InsertBulletinPost = z.infer<typeof insertBulletinPostSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
