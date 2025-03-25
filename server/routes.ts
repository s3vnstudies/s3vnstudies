import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertArticleSchema, 
  insertVideoSchema, 
  insertProductSchema, 
  insertChatRoomSchema, 
  insertChatMessageSchema,
  insertBulletinPostSchema,
  insertOrderSchema,
  ChatMessage
} from "@shared/schema";

// Interface for our WebSocket messages
interface WSMessage {
  type: string;
  payload: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server for chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections by user ID
  const clients = new Map<number, WebSocket>();
  
  wss.on('connection', (ws, request) => {
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as WSMessage;
        
        if (parsedMessage.type === 'auth') {
          // Store user connection
          const userId = parsedMessage.payload.userId;
          if (userId) {
            clients.set(userId, ws);
          }
        } else if (parsedMessage.type === 'chat_message') {
          // Handle chat message
          const { roomId, userId, content } = parsedMessage.payload;
          
          if (!roomId || !userId || !content) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'Invalid message format' }
            }));
            return;
          }
          
          // Validate user and room exist
          const user = await storage.getUser(userId);
          const room = await storage.getChatRoom(roomId);
          
          if (!user || !room) {
            ws.send(JSON.stringify({
              type: 'error',
              payload: { message: 'User or room not found' }
            }));
            return;
          }
          
          // Save message to storage
          const newMessage = await storage.createChatMessage({
            roomId,
            userId,
            content
          });
          
          // Get full user info to send with message
          const messageWithUser = {
            ...newMessage,
            user: {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              avatar: user.avatar
            }
          };
          
          // Broadcast to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'new_message',
                payload: messageWithUser
              }));
            }
          });
        } else if (parsedMessage.type === 'join_room') {
          // Handle room joining
          const { roomId, userId } = parsedMessage.payload;
          
          // Get chat history
          const messages = await storage.getChatMessages(roomId);
          
          // Get user info for each message
          const messagesWithUsers = await Promise.all(
            messages.map(async (message) => {
              const user = await storage.getUser(message.userId);
              return {
                ...message,
                user: user ? {
                  id: user.id,
                  username: user.username,
                  displayName: user.displayName,
                  avatar: user.avatar
                } : null
              };
            })
          );
          
          // Send chat history to client
          ws.send(JSON.stringify({
            type: 'chat_history',
            payload: {
              roomId,
              messages: messagesWithUsers
            }
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          payload: { message: 'Invalid message format' }
        }));
      }
    });
    
    ws.on('close', () => {
      // Remove client from map when disconnected
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId);
          break;
        }
      }
    });
  });
  
  // API Routes
  
  // Subscription Tiers
  app.get('/api/subscription-tiers', async (req, res) => {
    try {
      const tiers = await storage.getSubscriptionTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subscription tiers' });
    }
  });
  
  // Articles
  app.get('/api/articles', async (req, res) => {
    try {
      const isPremium = req.query.premium === 'true';
      let articles;
      
      if (req.query.premium !== undefined) {
        articles = await storage.getArticles(isPremium);
      } else {
        articles = await storage.getArticles();
      }
      
      // If not authenticated or not premium user, filter out premium content
      if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.subscription === 'none')) {
        articles = articles.filter(article => !article.isPremium);
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching articles' });
    }
  });
  
  app.get('/api/articles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Check if premium content is accessible
      if (article.isPremium && (!req.isAuthenticated() || req.user.subscription === 'none')) {
        return res.status(403).json({ message: 'Premium content requires subscription' });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching article' });
    }
  });
  
  app.post('/api/articles', async (req, res) => {
    try {
      // Only admins can create articles
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating article' });
    }
  });
  
  // Videos
  app.get('/api/videos', async (req, res) => {
    try {
      const isPremium = req.query.premium === 'true';
      let videos;
      
      if (req.query.premium !== undefined) {
        videos = await storage.getVideos(isPremium);
      } else {
        videos = await storage.getVideos();
      }
      
      // If not authenticated or not premium user, filter out premium content
      if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.subscription === 'none')) {
        videos = videos.filter(video => !video.isPremium);
      }
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching videos' });
    }
  });
  
  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      // Check if premium content is accessible
      if (video.isPremium && (!req.isAuthenticated() || req.user.subscription === 'none')) {
        return res.status(403).json({ message: 'Premium content requires subscription' });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching video' });
    }
  });
  
  app.post('/api/videos', async (req, res) => {
    try {
      // Only admins can create videos
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid video data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating video' });
    }
  });
  
  // Chat rooms
  app.get('/api/chat-rooms', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chat rooms' });
    }
  });
  
  app.post('/api/chat-rooms', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const roomData = insertChatRoomSchema.parse({
        ...req.body,
        createdById: req.user.id
      });
      
      const room = await storage.createChatRoom(roomData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid chat room data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating chat room' });
    }
  });
  
  // Chat messages - for initial loading (real-time happens over WebSocket)
  app.get('/api/chat-rooms/:roomId/messages', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const roomId = parseInt(req.params.roomId);
      const messages = await storage.getChatMessages(roomId);
      
      // Get user info for each message
      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const user = await storage.getUser(message.userId);
          return {
            ...message,
            user: user ? {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              avatar: user.avatar
            } : null
          };
        })
      );
      
      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chat messages' });
    }
  });
  
  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
  
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  });
  
  app.post('/api/products', async (req, res) => {
    try {
      // Only admins can create products
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating product' });
    }
  });
  
  // Bulletin board
  app.get('/api/bulletin', async (req, res) => {
    try {
      const posts = await storage.getBulletinPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bulletin posts' });
    }
  });
  
  app.post('/api/bulletin', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const postData = insertBulletinPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const post = await storage.createBulletinPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid bulletin post data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating bulletin post' });
    }
  });
  
  // Orders
  app.get('/api/orders', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const orders = await storage.getOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  app.post('/api/orders', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // In a real app, this would include payment processing
      const order = await storage.createOrder(orderData);
      
      // Process order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem(
            order.id,
            item.productId,
            item.quantity,
            item.price
          );
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating order' });
    }
  });

  return httpServer;
}
