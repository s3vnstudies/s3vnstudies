import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  articles, type Article, type InsertArticle,
  videos, type Video, type InsertVideo,
  chatRooms, type ChatRoom, type InsertChatRoom,
  chatMessages, type ChatMessage, type InsertChatMessage,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem,
  bulletinPosts, type BulletinPost, type InsertBulletinPost,
  subscriptionTiers, type SubscriptionTier, type InsertSubscriptionTier
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  
  // Article methods
  getArticles(isPremium?: boolean): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Video methods
  getVideos(isPremium?: boolean): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Chat methods
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoom(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  getChatMessages(roomId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Bulletin methods
  getBulletinPosts(): Promise<BulletinPost[]>;
  getBulletinPost(id: number): Promise<BulletinPost | undefined>;
  createBulletinPost(post: InsertBulletinPost): Promise<BulletinPost>;
  
  // Subscription methods
  getSubscriptionTiers(): Promise<SubscriptionTier[]>;
  getSubscriptionTier(id: number): Promise<SubscriptionTier | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private articles: Map<number, Article>;
  private videos: Map<number, Video>;
  private chatRooms: Map<number, ChatRoom>;
  private chatMessages: Map<number, ChatMessage>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private bulletinPosts: Map<number, BulletinPost>;
  private subscriptionTiers: Map<number, SubscriptionTier>;
  
  // IDs for auto-increment
  private userIdCounter: number;
  private productIdCounter: number;
  private articleIdCounter: number;
  private videoIdCounter: number;
  private chatRoomIdCounter: number;
  private chatMessageIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private bulletinPostIdCounter: number;
  private subscriptionTierIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.articles = new Map();
    this.videos = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.bulletinPosts = new Map();
    this.subscriptionTiers = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.articleIdCounter = 1;
    this.videoIdCounter = 1;
    this.chatRoomIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.bulletinPostIdCounter = 1;
    this.subscriptionTierIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize some default subscription tiers
    this._initSubscriptionTiers();
    
    // Initialize a general chat room
    this._initDefaultChatRoom();
  }
  
  // Helper method to initialize default subscription tiers
  private async _initSubscriptionTiers() {
    const basicTier: InsertSubscriptionTier = {
      name: "Basic",
      description: "Access to exclusive videos and community",
      features: ["Access to exclusive videos", "Community chat access", "Monthly newsletter"],
      monthlyPrice: "9.99",
      isPopular: true
    };
    
    const premiumTier: InsertSubscriptionTier = {
      name: "Premium",
      description: "Full access to all features and content",
      features: ["Access to exclusive videos", "Community chat access", "Monthly newsletter", "Live Q&A sessions", "Early access to content"],
      monthlyPrice: "19.99",
      yearlyPrice: null,
      isPopular: false
    };
    
    const proTier: InsertSubscriptionTier = {
      name: "Pro",
      description: "Our best value annual plan with exclusive merchandise",
      features: ["All Premium features", "Exclusive merchandise", "Private community access", "Priority support", "2 months free"],
      monthlyPrice: "15.00", // equivalent to $179.99/year
      yearlyPrice: "179.99",
      isPopular: false
    };
    
    await this.createSubscriptionTier(basicTier);
    await this.createSubscriptionTier(premiumTier);
    await this.createSubscriptionTier(proTier);
  }
  
  // Helper method to initialize default chat room
  private async _initDefaultChatRoom() {
    // Create admin user if it doesn't exist
    let adminId = 1;
    if (!this.users.has(adminId)) {
      const admin: InsertUser = {
        username: "admin",
        password: "admin_hashed_password", // This would be hashed properly in production
        email: "admin@s3vnstudies.com",
        displayName: "Administrator",
        bio: "Site Administrator",
        avatar: null,
      };
      const adminUser = await this.createUser(admin);
      adminId = adminUser.id;
    }
    
    const generalRoom: InsertChatRoom = {
      name: "General",
      description: "General discussion for all members",
      createdById: adminId,
      isPrivate: false
    };
    
    await this.createChatRoom(generalRoom);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "member", 
      subscription: "none", 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const now = new Date();
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Article methods
  async getArticles(isPremium?: boolean): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (isPremium !== undefined) {
      articles = articles.filter(article => article.isPremium === isPremium);
    }
    
    return articles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.category === category)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const now = new Date();
    const id = this.articleIdCounter++;
    const article: Article = { 
      ...insertArticle, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.articles.set(id, article);
    return article;
  }
  
  // Video methods
  async getVideos(isPremium?: boolean): Promise<Video[]> {
    let videos = Array.from(this.videos.values());
    
    if (isPremium !== undefined) {
      videos = videos.filter(video => video.isPremium === isPremium);
    }
    
    return videos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const now = new Date();
    const id = this.videoIdCounter++;
    const video: Video = { ...insertVideo, id, createdAt: now };
    this.videos.set(id, video);
    return video;
  }
  
  // Chat methods
  async getChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values());
  }
  
  async getChatRoom(id: number): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }
  
  async createChatRoom(insertChatRoom: InsertChatRoom): Promise<ChatRoom> {
    const now = new Date();
    const id = this.chatRoomIdCounter++;
    const chatRoom: ChatRoom = { ...insertChatRoom, id, createdAt: now };
    this.chatRooms.set(id, chatRoom);
    return chatRoom;
  }
  
  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.roomId === roomId)
      .sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const now = new Date();
    const id = this.chatMessageIdCounter++;
    const message: ChatMessage = { ...insertMessage, id, createdAt: now };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const now = new Date();
    const id = this.orderIdCounter++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      createdAt: now, 
      updatedAt: now 
    };
    this.orders.set(id, order);
    return order;
  }
  
  async createOrderItem(orderId: number, productId: number, quantity: number, price: string): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const orderItem: OrderItem = { id, orderId, productId, quantity, price };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
  
  // Bulletin methods
  async getBulletinPosts(): Promise<BulletinPost[]> {
    return Array.from(this.bulletinPosts.values())
      .sort((a, b) => {
        // Pinned posts first, then by date
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getBulletinPost(id: number): Promise<BulletinPost | undefined> {
    return this.bulletinPosts.get(id);
  }
  
  async createBulletinPost(insertPost: InsertBulletinPost): Promise<BulletinPost> {
    const now = new Date();
    const id = this.bulletinPostIdCounter++;
    const post: BulletinPost = { 
      ...insertPost, 
      id, 
      isPinned: false, 
      createdAt: now, 
      updatedAt: now 
    };
    this.bulletinPosts.set(id, post);
    return post;
  }
  
  // Subscription methods
  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return Array.from(this.subscriptionTiers.values());
  }
  
  async getSubscriptionTier(id: number): Promise<SubscriptionTier | undefined> {
    return this.subscriptionTiers.get(id);
  }
  
  async createSubscriptionTier(insertTier: InsertSubscriptionTier): Promise<SubscriptionTier> {
    const id = this.subscriptionTierIdCounter++;
    const tier: SubscriptionTier = { ...insertTier, id };
    this.subscriptionTiers.set(id, tier);
    return tier;
  }
}

export const storage = new MemStorage();
