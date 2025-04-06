import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupWebsockets } from "./websocket";
import { setupAdmin } from "./admin";
import { createTalkRequest, getTalkStatus, getAvailablePresenters, getAvailableVoices } from "./did-ai";
import path from "path";
import Stripe from "stripe";
import { 
  insertArticleSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertChatRoomSchema,
  insertBulletinPostSchema,
  insertVideoSchema,
  insertSubscriptionSchema,
  insertUserFavoriteSchema,
  insertWatchLaterSchema,
  type Video
} from "@shared/schema";
import { z } from "zod";
import { getYouTubeVideos, getYouTubeVideoDetails } from "./youtube";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key. Please add STRIPE_SECRET_KEY to environment variables.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  
  // Admin access is restricted to users with isAdmin flag
  if (req.user && req.user.isAdmin) {
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
      "pro": 1
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
  
  // Setup admin routes
  setupAdmin(app);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSockets
  setupWebsockets(httpServer);
  
  // Setup static files
  app.use('/static', express.static(path.join(process.cwd(), 'public/static')));
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
  app.use('/courses', express.static(path.join(process.cwd(), 'public/courses')));
  app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
  
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
  
  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const articles = await storage.getArticlesByCategory(category);
      res.json(articles);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch articles by category" });
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
      // Make sure user ID is defined (requireAuth middleware ensures this)
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Get orders for the current user
      const orders = await storage.getOrders(userId);
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Ensure user ID is set to the current user
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: userId
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const roomData = insertChatRoomSchema.parse({
        ...req.body,
        createdBy: userId
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const postData = insertBulletinPostSchema.parse({
        ...req.body,
        userId: userId
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
          "pro": 1
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
  
  // Favorite Videos
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videos = await storage.getFavoriteVideos(userId);
      res.json(videos);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch favorite videos" });
    }
  });
  
  app.post("/api/favorites/:videoId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videoId = parseInt(req.params.videoId);
      const video = await storage.getVideoById(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Check if already favorited
      const isAlreadyFavorited = await storage.isVideoFavorited(userId, videoId);
      if (isAlreadyFavorited) {
        return res.status(400).json({ message: "Video already in favorites" });
      }
      
      const favorite = await storage.addVideoToFavorites(userId, videoId);
      res.status(201).json({ message: "Video added to favorites", favorite });
    } catch (err) {
      res.status(500).json({ message: "Failed to add video to favorites" });
    }
  });
  
  app.delete("/api/favorites/:videoId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videoId = parseInt(req.params.videoId);
      
      // Check if favorited
      const isVideoFavorited = await storage.isVideoFavorited(userId, videoId);
      if (!isVideoFavorited) {
        return res.status(404).json({ message: "Video not in favorites" });
      }
      
      const success = await storage.removeVideoFromFavorites(userId, videoId);
      if (!success) {
        return res.status(500).json({ message: "Failed to remove from favorites" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to remove video from favorites" });
    }
  });
  
  // Watch Later Videos
  app.get("/api/watch-later", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videos = await storage.getWatchLaterVideos(userId);
      res.json(videos);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch watch later videos" });
    }
  });
  
  app.post("/api/watch-later/:videoId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videoId = parseInt(req.params.videoId);
      const video = await storage.getVideoById(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Check if already in watch later
      const isAlreadyInWatchLater = await storage.isVideoInWatchLater(userId, videoId);
      if (isAlreadyInWatchLater) {
        return res.status(400).json({ message: "Video already in watch later" });
      }
      
      const watchLater = await storage.addVideoToWatchLater(userId, videoId);
      res.status(201).json({ message: "Video added to watch later", watchLater });
    } catch (err) {
      res.status(500).json({ message: "Failed to add video to watch later" });
    }
  });
  
  app.delete("/api/watch-later/:videoId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const videoId = parseInt(req.params.videoId);
      
      // Check if in watch later
      const isVideoInWatchLater = await storage.isVideoInWatchLater(userId, videoId);
      if (!isVideoInWatchLater) {
        return res.status(404).json({ message: "Video not in watch later" });
      }
      
      const success = await storage.removeVideoFromWatchLater(userId, videoId);
      if (!success) {
        return res.status(500).json({ message: "Failed to remove from watch later" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to remove video from watch later" });
    }
  });
  
  // YouTube Integration
  app.get("/api/youtube/videos", getYouTubeVideos);
  app.get("/api/youtube/videos/:videoId", getYouTubeVideoDetails);
  
  // YouTube Sync - Creates/Updates videos in our database from YouTube channel
  app.post("/api/youtube/sync", requireAdmin, async (req, res) => {
    try {
      const channelId = req.body.channelId || '@s3vnstudies';
      const maxResults = req.body.maxResults || 20;
      
      // Fetch videos from YouTube
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelId)}&type=channel&key=${process.env.YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }
      
      const channelData = await response.json();
      let actualChannelId;
      
      if (channelData.items && channelData.items.length > 0) {
        actualChannelId = channelData.items[0].id.channelId;
      } else {
        return res.status(404).json({ message: 'Channel not found' });
      }
      
      // Fetch videos from the channel
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`
      );
      
      if (!videosResponse.ok) {
        throw new Error(`YouTube API error: ${videosResponse.statusText}`);
      }
      
      const videosData = await videosResponse.json();
      
      // Process each video
      const syncedVideos = [];
      for (const item of videosData.items) {
        // Get detailed video information
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${item.id.videoId}&key=${process.env.YOUTUBE_API_KEY}`
        );
        
        if (!detailsResponse.ok) continue;
        
        const detailsData = await detailsResponse.json();
        if (!detailsData.items || !detailsData.items[0]) continue;
        
        const videoDetails = detailsData.items[0];
        
        // Create or update video in our database
        const videoData = {
          title: videoDetails.snippet.title,
          description: videoDetails.snippet.description || null,
          imageUrl: videoDetails.snippet.thumbnails.high.url || null,
          videoUrl: `https://www.youtube.com/watch?v=${videoDetails.id}` || null,
          embedUrl: `https://www.youtube.com/embed/${videoDetails.id}` || null,
          duration: videoDetails.contentDetails.duration || null,
          publishDate: new Date(videoDetails.snippet.publishedAt),
          views: parseInt(videoDetails.statistics.viewCount || "0"),
          membershipRequired: "free" as const, // Default all YouTube videos to free
          category: "youtube",
          featured: false,
          externalId: videoDetails.id,
          source: "youtube"
        };
        
        // Check if the video already exists in our database by externalId
        const existingVideos = await storage.getVideos();
        const existingVideo = existingVideos.find(v => v.externalId === videoDetails.id);
        
        let video;
        if (existingVideo) {
          // Update existing video
          video = await storage.updateVideo(existingVideo.id, videoData);
        } else {
          // Create new video
          video = await storage.createVideo(videoData);
        }
        
        syncedVideos.push(video);
      }
      
      res.json({ 
        success: true, 
        message: `Successfully synced ${syncedVideos.length} videos`,
        videos: syncedVideos
      });
    } catch (error: any) {
      console.error('Error syncing YouTube videos:', error);
      res.status(500).json({ 
        message: 'Failed to sync YouTube videos',
        error: error.message 
      });
    }
  });
  
  // Schedule daily YouTube sync at midnight
  setInterval(async () => {
    try {
      const now = new Date();
      // Check if it's midnight (00:00)
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        console.log('Running scheduled YouTube sync...');
        const channelId = '@s3vnstudies';
        const maxResults = 20;
        
        // Fetch videos from YouTube - similar logic as the sync endpoint
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelId)}&type=channel&key=${process.env.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.statusText}`);
        }
        
        const channelData = await response.json();
        let actualChannelId;
        
        if (channelData.items && channelData.items.length > 0) {
          actualChannelId = channelData.items[0].id.channelId;
        } else {
          throw new Error('Channel not found');
        }
        
        // Fetch videos from the channel
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`
        );
        
        if (!videosResponse.ok) {
          throw new Error(`YouTube API error: ${videosResponse.statusText}`);
        }
        
        const videosData = await videosResponse.json();
        
        // Process each video
        let syncedCount = 0;
        for (const item of videosData.items) {
          // Get detailed video information
          const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${item.id.videoId}&key=${process.env.YOUTUBE_API_KEY}`
          );
          
          if (!detailsResponse.ok) continue;
          
          const detailsData = await detailsResponse.json();
          if (!detailsData.items || !detailsData.items[0]) continue;
          
          const videoDetails = detailsData.items[0];
          
          // Create or update video in our database
          const videoData = {
            title: videoDetails.snippet.title,
            description: videoDetails.snippet.description || null,
            imageUrl: videoDetails.snippet.thumbnails.high.url || null,
            videoUrl: `https://www.youtube.com/watch?v=${videoDetails.id}` || null,
            embedUrl: `https://www.youtube.com/embed/${videoDetails.id}` || null,
            duration: videoDetails.contentDetails.duration || null,
            publishDate: new Date(videoDetails.snippet.publishedAt),
            views: parseInt(videoDetails.statistics.viewCount || "0"),
            membershipRequired: "free" as const, // Default all YouTube videos to free
            category: "youtube",
            featured: false,
            externalId: videoDetails.id,
            source: "youtube"
          };
          
          // Check if the video already exists in our database by externalId
          const existingVideos = await storage.getVideos();
          const existingVideo = existingVideos.find(v => v.externalId === videoDetails.id);
          
          if (existingVideo) {
            // Update existing video
            await storage.updateVideo(existingVideo.id, videoData);
          } else {
            // Create new video
            await storage.createVideo(videoData);
            syncedCount++;
          }
        }
        
        console.log(`Scheduled YouTube sync complete - added ${syncedCount} new videos`);
      }
    } catch (error) {
      console.error('Error in scheduled YouTube sync:', error);
    }
  }, 60000); // Check every minute
  
  // Stripe Payment Integration
  app.post("/api/create-subscription-intent", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Create a payment intent for $2.99 subscription
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 299, // $2.99 in cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId: userId.toString(),
          type: "subscription",
          tier: "pro"
        },
        receipt_email: userEmail,
        description: "Pro Membership Subscription ($2.99/month)"
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({
        message: "Error creating payment intent",
        error: error.message
      });
    }
  });
  
  app.post("/api/complete-subscription", requireAuth, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Verify payment intent exists and is successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment has not been completed" });
      }
      
      // Check the metadata to ensure it matches our expectations
      if (paymentIntent.metadata.userId !== userId.toString() || 
          paymentIntent.metadata.type !== "subscription" ||
          paymentIntent.metadata.tier !== "pro") {
        return res.status(400).json({ message: "Invalid payment intent metadata" });
      }
      
      // Create subscription in our system
      const subscription = await storage.createSubscription({
        userId: userId,
        tier: "pro",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        active: true,
        autoRenew: true
      });
      
      // Update user's membership tier
      await storage.updateUser(userId, { membershipTier: "pro" });
      
      res.json({ success: true, subscription });
    } catch (error: any) {
      console.error("Error completing subscription:", error);
      res.status(500).json({
        message: "Error completing subscription",
        error: error.message
      });
    }
  });
  
  // Simple upgrade endpoint for testing (no payment processing)
  app.post("/api/upgrade-membership", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Create a subscription in our system
      const subscription = await storage.createSubscription({
        userId: userId,
        tier: "pro",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        active: true,
        autoRenew: true
      });
      
      // Update user's membership tier
      await storage.updateUser(userId, { membershipTier: "pro" });
      
      res.json({ success: true, subscription });
    } catch (error: any) {
      console.error("Error upgrading membership:", error);
      res.status(500).json({
        message: "Error upgrading membership",
        error: error.message
      });
    }
  });
  
  // Subscriptions
  app.get("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const subscription = await storage.getSubscription(userId);
      res.json(subscription || null);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
  
  app.post("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Validate that tier is pro
      if (req.body.tier !== 'pro') {
        return res.status(400).json({ message: "Invalid membership tier" });
      }
      
      // Check if user already has an active subscription
      const existingSubscription = await storage.getSubscription(userId);
      
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
        userId: userId
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscription(userId);
      
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Only allow updating certain fields
      const allowedFields = ['displayName', 'bio', 'avatarUrl'];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
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
  
  // D-ID AI Assistant Integration
  app.post("/api/ai/talk", async (req, res) => {
    createTalkRequest(req, res);
  });

  app.get("/api/ai/talk/:id", async (req, res) => {
    getTalkStatus(req, res);
  });

  app.get("/api/ai/presenters", async (req, res) => {
    getAvailablePresenters(req, res);
  });

  app.get("/api/ai/voices", async (req, res) => {
    getAvailableVoices(req, res);
  });
  
  return httpServer;
}
