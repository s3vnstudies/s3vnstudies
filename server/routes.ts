import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupWebSocketServer } from "./websocket";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertContentSchema,
  insertProductSchema,
  insertChatRoomSchema,
  insertBulletinPostSchema,
  insertOrderSchema,
  insertSubscriptionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server for chat
  setupWebSocketServer(httpServer);
  
  // Content routes
  app.get("/api/contents", async (req, res, next) => {
    try {
      const premium = req.query.premium === "true";
      const authorId = req.query.authorId ? parseInt(req.query.authorId as string) : undefined;
      
      const contents = await storage.getContents({ premium, authorId });
      res.json(contents);
    } catch (err) {
      next(err);
    }
  });
  
  app.get("/api/contents/:id", async (req, res, next) => {
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/contents", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertContentSchema.parse({
        ...req.body,
        authorId: req.user?.id
      });
      
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (err) {
      next(err);
    }
  });
  
  app.patch("/api/contents/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Only author or admin can update
      if (content.authorId !== req.user?.id && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedContent = await storage.updateContent(contentId, req.body);
      res.json(updatedContent);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete("/api/contents/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Only author or admin can delete
      if (content.authorId !== req.user?.id && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.deleteContent(contentId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res, next) => {
    try {
      const category = req.query.category as string | undefined;
      const onSale = req.query.onSale === "true" ? true : undefined;
      
      const products = await storage.getProducts({ category, onSale });
      res.json(products);
    } catch (err) {
      next(err);
    }
  });
  
  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/products", async (req, res, next) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  });
  
  app.patch("/api/products/:id", async (req, res, next) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const updatedProduct = await storage.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete("/api/products/:id", async (req, res, next) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const productId = parseInt(req.params.id);
      await storage.deleteProduct(productId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
  
  // Chat room routes
  app.get("/api/chat/rooms", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/chat/rooms", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertChatRoomSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      
      const room = await storage.createChatRoom(validatedData);
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  });
  
  app.get("/api/chat/rooms/:id/messages", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const roomId = parseInt(req.params.id);
      const room = await storage.getChatRoom(roomId);
      
      if (!room) {
        return res.status(404).json({ message: "Chat room not found" });
      }
      
      const messages = await storage.getChatMessages(roomId);
      res.json(messages);
    } catch (err) {
      next(err);
    }
  });
  
  // Bulletin board routes
  app.get("/api/bulletin", async (req, res, next) => {
    try {
      const posts = await storage.getBulletinPosts();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/bulletin", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertBulletinPostSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const post = await storage.createBulletinPost(validatedData);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  });
  
  app.patch("/api/bulletin/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getBulletinPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only author or admin can update
      if (post.userId !== req.user?.id && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedPost = await storage.updateBulletinPost(postId, req.body);
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete("/api/bulletin/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getBulletinPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only author or admin can delete
      if (post.userId !== req.user?.id && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.deleteBulletinPost(postId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
  
  // Order routes
  app.get("/api/orders", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const orders = await storage.getOrders(req.user?.id);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/orders", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  });
  
  // Subscription routes
  app.get("/api/subscription", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const subscription = await storage.getSubscription(req.user?.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription" });
      }
      
      res.json(subscription);
    } catch (err) {
      next(err);
    }
  });
  
  app.post("/api/subscription", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      // Check if user already has a subscription
      const existingSubscription = await storage.getSubscription(req.user?.id);
      
      if (existingSubscription) {
        return res.status(400).json({ message: "User already has a subscription" });
      }
      
      const validatedData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user?.id,
        startDate: new Date(),
        status: "active"
      });
      
      const subscription = await storage.createSubscription(validatedData);
      
      // Update user's membership tier
      await storage.updateUser(req.user?.id, { membershipTier: subscription.tier });
      
      res.status(201).json(subscription);
    } catch (err) {
      next(err);
    }
  });
  
  app.patch("/api/subscription", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const subscription = await storage.getSubscription(req.user?.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription" });
      }
      
      const updatedSubscription = await storage.updateSubscription(req.user?.id, req.body);
      
      // If tier is being updated, also update user's membership tier
      if (req.body.tier) {
        await storage.updateUser(req.user?.id, { membershipTier: req.body.tier });
      }
      
      res.json(updatedSubscription);
    } catch (err) {
      next(err);
    }
  });

  return httpServer;
}
