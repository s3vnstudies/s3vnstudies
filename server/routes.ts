import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupWebsockets } from "./websocket";
import { 
  insertArticleSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertChatRoomSchema,
  insertBulletinPostSchema,
  insertVideoSchema,
  insertSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";

// Authentication middleware
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based access control
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // For simplicity, we'll consider user ID 1 as admin
  if (req.user && req.user.id === 1) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
}

// Membership tier verification
function requireMembership(tier: string) {
  return async (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1,
      "vip": 2
    };
    
    const requiredLevel = tierLevels[tier];
    const userLevel = tierLevels[req.user?.membershipTier || "free"];
    
    if (userLevel >= requiredLevel) {
      next();
    } else {
      return res.status(403).json({ 
        message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} membership required` 
      });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSockets
  setupWebsockets(httpServer);
  
  // API ROUTES
  
  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Check if article requires membership
      if (article.membershipRequired !== "free" && (!req.user || req.user.membershipTier === "free")) {
        return res.status(403).json({ 
          message: `${article.membershipRequired.charAt(0).toUpperCase() + article.membershipRequired.slice(1)} membership required` 
        });
      }
      
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  
  app.post("/api/articles", requireAdmin, async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });
  
  app.put("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });
  
  app.delete("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const products = await storage.getProducts(limit, offset);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      // Get orders for the current user
      const orders = await storage.getOrders(req.user?.id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if this order belongs to the current user
      if (order.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(id);
      
      res.json({ ...order, items: orderItems });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      // Ensure user ID is set to the current user
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const orderItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          
          await storage.createOrderItem(orderItemData);
        }
      }
      
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Chat Rooms
  app.get("/api/chat/rooms", requireAuth, async (req, res) => {
    try {
      // Get rooms based on user's membership tier
      const tier = req.user?.membershipTier || "free";
      const rooms = await storage.getChatRoomsByMembershipTier(tier);
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });
  
  app.post("/api/chat/rooms", requireMembership("pro"), async (req, res) => {
    try {
      const roomData = insertChatRoomSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      
      const room = await storage.createChatRoom(roomData);
      res.status(201).json(room);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid room data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create chat room" });
    }
  });
  
  // Bulletin Posts
  app.get("/api/bulletin", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const posts = await storage.getBulletinPosts(limit, offset);
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch bulletin posts" });
    }
  });
  
  app.post("/api/bulletin", requireAuth, async (req, res) => {
    try {
      const postData = insertBulletinPostSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const post = await storage.createBulletinPost(postData);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create bulletin post" });
    }
  });
  
  app.delete("/api/bulletin/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBulletinPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if this post belongs to the current user
      if (post.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const success = await storage.deleteBulletinPost(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete post" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete bulletin post" });
    }
  });
  
  // Videos
  app.get("/api/videos", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      // If user is logged in, get videos based on membership tier
      if (req.isAuthenticated() && req.user) {
        const tier = req.user.membershipTier;
        const videos = await storage.getVideosByMembershipTier(tier);
        return res.json(videos.slice(offset, offset + limit));
      }
      
      // Otherwise, only get free videos
      const videos = await storage.getVideosByMembershipTier("free");
      res.json(videos.slice(offset, offset + limit));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });
  
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideoById(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Check if video requires membership
      if (video.membershipRequired !== "free") {
        if (!req.isAuthenticated()) {
          return res.status(403).json({ message: "Membership required" });
        }
        
        const tierLevels: Record<string, number> = {
          "free": 0,
          "pro": 1,
          "vip": 2
        };
        
        const requiredLevel = tierLevels[video.membershipRequired];
        const userLevel = tierLevels[req.user?.membershipTier || "free"];
        
        if (userLevel < requiredLevel) {
          return res.status(403).json({ 
            message: `${video.membershipRequired.charAt(0).toUpperCase() + video.membershipRequired.slice(1)} membership required` 
          });
        }
      }
      
      res.json(video);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });
  
  app.post("/api/videos", requireAdmin, async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });
  
  // Subscriptions
  app.get("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      const subscription = await storage.getSubscription(req.user?.id);
      res.json(subscription || null);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
  
  app.post("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      // Validate that tier is either pro or vip
      if (!['pro', 'vip'].includes(req.body.tier)) {
        return res.status(400).json({ message: "Invalid membership tier" });
      }
      
      // Check if user already has an active subscription
      const existingSubscription = await storage.getSubscription(req.user?.id);
      
      if (existingSubscription) {
        // Update the existing subscription instead
        const updatedSubscription = await storage.updateSubscription(existingSubscription.id, {
          tier: req.body.tier,
          autoRenew: req.body.autoRenew
        });
        
        return res.json(updatedSubscription);
      }
      
      // Create a new subscription
      const subscriptionData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      // Set end date to 30 days from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      subscriptionData.endDate = endDate;
      
      const subscription = await storage.createSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  
  app.delete("/api/subscriptions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscription(req.user?.id);
      
      if (!subscription || subscription.id !== id) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      const success = await storage.cancelSubscription(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to cancel subscription" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });
  
  // User Profile
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user?.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...userProfile } = user;
      
      res.json(userProfile);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      // Only allow updating certain fields
      const allowedFields = ['displayName', 'bio', 'avatarUrl'];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(req.user?.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...userProfile } = updatedUser;
      
      res.json(userProfile);
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  return httpServer;
}
