import { 
  users, type User, type InsertUser, 
  articles, type Article, type InsertArticle,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  chatRooms, type ChatRoom, type InsertChatRoom,
  chatMessages, type ChatMessage, type InsertChatMessage,
  bulletinPosts, type BulletinPost, type InsertBulletinPost,
  videos, type Video, type InsertVideo,
  subscriptions, type Subscription, type InsertSubscription
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Article operations
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticlesByMembershipTier(tier: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, articleData: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId?: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order items operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Chat room operations
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  getChatRoomsByMembershipTier(tier: string): Promise<ChatRoom[]>;
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  
  // Chat message operations
  getChatMessages(roomId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Bulletin post operations
  getBulletinPosts(limit?: number, offset?: number): Promise<BulletinPost[]>;
  getBulletinPostById(id: number): Promise<BulletinPost | undefined>;
  getBulletinPostsByCategory(category: string): Promise<BulletinPost[]>;
  createBulletinPost(post: InsertBulletinPost): Promise<BulletinPost>;
  deleteBulletinPost(id: number): Promise<boolean>;
  
  // Video operations
  getVideos(limit?: number, offset?: number): Promise<Video[]>;
  getVideoById(id: number): Promise<Video | undefined>;
  getVideosByMembershipTier(tier: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, videoData: Partial<Video>): Promise<Video | undefined>;
  
  // Subscription operations
  getSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private chatRooms: Map<number, ChatRoom>;
  private chatMessages: Map<number, ChatMessage>;
  private bulletinPosts: Map<number, BulletinPost>;
  private videos: Map<number, Video>;
  private subscriptions: Map<number, Subscription>;
  
  private userId: number = 1;
  private articleId: number = 1;
  private productId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private chatRoomId: number = 1;
  private chatMessageId: number = 1;
  private bulletinPostId: number = 1;
  private videoId: number = 1;
  private subscriptionId: number = 1;
  
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.bulletinPosts = new Map();
    this.videos = new Map();
    this.subscriptions = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some example data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Create some initial chat rooms
    this.createChatRoom({
      name: "General Discussion",
      description: "A place to discuss anything related to S3vn Studies",
      createdBy: 1,
      isPrivate: false,
      membershipRequired: "free"
    });
    
    this.createChatRoom({
      name: "Philosophy",
      description: "Discuss philosophical topics and ideas",
      createdBy: 1,
      isPrivate: false,
      membershipRequired: "pro"
    });
    
    this.createChatRoom({
      name: "VIP Lounge",
      description: "Exclusive chat for VIP members",
      createdBy: 1,
      isPrivate: true,
      membershipRequired: "vip"
    });
  }
  
  // User operations
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
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    
    const user: User = {
      id,
      ...userData,
      membershipTier: "free",
      memberSince: now,
      bio: "",
      avatarUrl: ""
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
  
  // Article operations
  async getArticles(limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(offset, offset + limit);
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.category === category)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getArticlesByMembershipTier(tier: string): Promise<Article[]> {
    // This will return articles that the specified tier can access
    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1,
      "vip": 2
    };
    
    const userTierLevel = tierLevels[tier];
    
    return Array.from(this.articles.values())
      .filter(article => {
        const articleTierLevel = tierLevels[article.membershipRequired];
        return articleTierLevel <= userTierLevel;
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async createArticle(articleData: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const now = new Date();
    
    const article: Article = {
      id,
      ...articleData,
      publishDate: now
    };
    
    this.articles.set(id, article);
    return article;
  }
  
  async updateArticle(id: number, articleData: Partial<Article>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...articleData };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    if (!this.articles.has(id)) return false;
    return this.articles.delete(id);
  }
  
  // Product operations
  async getProducts(limit = 10, offset = 0): Promise<Product[]> {
    return Array.from(this.products.values())
      .slice(offset, offset + limit);
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category);
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.isFeatured);
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productId++;
    
    const product: Product = {
      id,
      ...productData
    };
    
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
  
  async deleteProduct(id: number): Promise<boolean> {
    if (!this.products.has(id)) return false;
    return this.products.delete(id);
  }
  
  // Order operations
  async getOrders(userId?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }
    
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    
    const order: Order = {
      id,
      ...orderData,
      orderDate: now
    };
    
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order items operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
  
  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    
    const orderItem: OrderItem = {
      id,
      ...orderItemData
    };
    
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Chat room operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values());
  }
  
  async getChatRoomById(id: number): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }
  
  async getChatRoomsByMembershipTier(tier: string): Promise<ChatRoom[]> {
    // This will return chat rooms that the specified tier can access
    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1,
      "vip": 2
    };
    
    const userTierLevel = tierLevels[tier];
    
    return Array.from(this.chatRooms.values())
      .filter(room => {
        const roomTierLevel = tierLevels[room.membershipRequired];
        return roomTierLevel <= userTierLevel;
      });
  }
  
  async createChatRoom(roomData: InsertChatRoom): Promise<ChatRoom> {
    const id = this.chatRoomId++;
    const now = new Date();
    
    const chatRoom: ChatRoom = {
      id,
      ...roomData,
      createdAt: now
    };
    
    this.chatRooms.set(id, chatRoom);
    return chatRoom;
  }
  
  // Chat message operations
  async getChatMessages(roomId: number, limit = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.roomId === roomId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
      .slice(-limit);
  }
  
  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageId++;
    const now = new Date();
    
    const chatMessage: ChatMessage = {
      id,
      ...messageData,
      sentAt: now
    };
    
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  // Bulletin post operations
  async getBulletinPosts(limit = 10, offset = 0): Promise<BulletinPost[]> {
    return Array.from(this.bulletinPosts.values())
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(offset, offset + limit);
  }
  
  async getBulletinPostById(id: number): Promise<BulletinPost | undefined> {
    return this.bulletinPosts.get(id);
  }
  
  async getBulletinPostsByCategory(category: string): Promise<BulletinPost[]> {
    return Array.from(this.bulletinPosts.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }
  
  async createBulletinPost(postData: InsertBulletinPost): Promise<BulletinPost> {
    const id = this.bulletinPostId++;
    const now = new Date();
    
    const bulletinPost: BulletinPost = {
      id,
      ...postData,
      postedAt: now
    };
    
    this.bulletinPosts.set(id, bulletinPost);
    return bulletinPost;
  }
  
  async deleteBulletinPost(id: number): Promise<boolean> {
    if (!this.bulletinPosts.has(id)) return false;
    return this.bulletinPosts.delete(id);
  }
  
  // Video operations
  async getVideos(limit = 10, offset = 0): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(offset, offset + limit);
  }
  
  async getVideoById(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async getVideosByMembershipTier(tier: string): Promise<Video[]> {
    // This will return videos that the specified tier can access
    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1,
      "vip": 2
    };
    
    const userTierLevel = tierLevels[tier];
    
    return Array.from(this.videos.values())
      .filter(video => {
        const videoTierLevel = tierLevels[video.membershipRequired];
        return videoTierLevel <= userTierLevel;
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async createVideo(videoData: InsertVideo): Promise<Video> {
    const id = this.videoId++;
    const now = new Date();
    
    const video: Video = {
      id,
      ...videoData,
      publishDate: now
    };
    
    this.videos.set(id, video);
    return video;
  }
  
  async updateVideo(id: number, videoData: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...videoData };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }
  
  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.active);
  }
  
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const now = new Date();
    
    const subscription: Subscription = {
      id,
      ...subscriptionData,
      startDate: now
    };
    
    this.subscriptions.set(id, subscription);
    
    // Update user's membership tier
    const user = await this.getUser(subscriptionData.userId);
    if (user) {
      await this.updateUser(user.id, { membershipTier: subscriptionData.tier });
    }
    
    return subscription;
  }
  
  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...subscriptionData };
    this.subscriptions.set(id, updatedSubscription);
    
    // If tier is changing, update user's membership tier
    if (subscriptionData.tier && subscription.tier !== subscriptionData.tier) {
      const user = await this.getUser(subscription.userId);
      if (user) {
        await this.updateUser(user.id, { membershipTier: subscriptionData.tier });
      }
    }
    
    return updatedSubscription;
  }
  
  async cancelSubscription(id: number): Promise<boolean> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return false;
    
    const now = new Date();
    const updatedSubscription = { 
      ...subscription, 
      active: false,
      autoRenew: false,
      endDate: subscription.endDate || now
    };
    
    this.subscriptions.set(id, updatedSubscription);
    
    // Revert user to free tier
    const user = await this.getUser(subscription.userId);
    if (user) {
      await this.updateUser(user.id, { membershipTier: "free" });
    }
    
    return true;
  }
}

export const storage = new MemStorage();
