import { 
  users, type User, type InsertUser,
  contents, type Content, type InsertContent,
  products, type Product, type InsertProduct,
  chatRooms, type ChatRoom, type InsertChatRoom,
  chatMessages, type ChatMessage, type InsertChatMessage,
  bulletinPosts, type BulletinPost, type InsertBulletinPost,
  orders, type Order, type InsertOrder,
  subscriptions, type Subscription, type InsertSubscription
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Content operations
  getContents(options?: { premium?: boolean, authorId?: number }): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, contentData: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(options?: { category?: string, onSale?: boolean }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Chat operations
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoom(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  getChatMessages(roomId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Bulletin operations
  getBulletinPosts(): Promise<BulletinPost[]>;
  getBulletinPost(id: number): Promise<BulletinPost | undefined>;
  createBulletinPost(post: InsertBulletinPost): Promise<BulletinPost>;
  updateBulletinPost(id: number, postData: Partial<BulletinPost>): Promise<BulletinPost | undefined>;
  deleteBulletinPost(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderData: Partial<Order>): Promise<Order | undefined>;
  
  // Subscription operations
  getSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private products: Map<number, Product>;
  private chatRooms: Map<number, ChatRoom>;
  private chatMessages: Map<number, ChatMessage[]>;
  private bulletinPosts: Map<number, BulletinPost>;
  private orders: Map<number, Order>;
  private subscriptions: Map<number, Subscription>;
  sessionStore: session.SessionStore;
  
  private currentIds: {
    users: number;
    contents: number;
    products: number;
    chatRooms: number;
    chatMessages: number;
    bulletinPosts: number;
    orders: number;
    subscriptions: number;
  };

  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.products = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.bulletinPosts = new Map();
    this.orders = new Map();
    this.subscriptions = new Map();
    
    this.currentIds = {
      users: 1,
      contents: 1,
      products: 1,
      chatRooms: 1,
      chatMessages: 1,
      bulletinPosts: 1,
      orders: 1,
      subscriptions: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some demo products
    this.seedProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user", 
      membershipTier: "free",
      createdAt
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
  
  // Content operations
  async getContents(options?: { premium?: boolean, authorId?: number }): Promise<Content[]> {
    let contents = Array.from(this.contents.values());
    
    if (options?.premium !== undefined) {
      contents = contents.filter(content => content.premium === options.premium);
    }
    
    if (options?.authorId !== undefined) {
      contents = contents.filter(content => content.authorId === options.authorId);
    }
    
    return contents;
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async createContent(content: InsertContent): Promise<Content> {
    const id = this.currentIds.contents++;
    const now = new Date();
    const newContent: Content = {
      ...content,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.contents.set(id, newContent);
    return newContent;
  }
  
  async updateContent(id: number, contentData: Partial<Content>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    const updatedContent = { 
      ...content, 
      ...contentData,
      updatedAt: new Date()
    };
    this.contents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
  
  // Product operations
  async getProducts(options?: { category?: string, onSale?: boolean }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (options?.category) {
      products = products.filter(product => product.category === options.category);
    }
    
    if (options?.onSale !== undefined) {
      products = products.filter(product => product.onSale === options.onSale);
    }
    
    return products;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentIds.products++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Chat operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values());
  }
  
  async getChatRoom(id: number): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }
  
  async createChatRoom(room: InsertChatRoom): Promise<ChatRoom> {
    const id = this.currentIds.chatRooms++;
    const now = new Date();
    const newRoom: ChatRoom = {
      ...room,
      id,
      createdAt: now
    };
    this.chatRooms.set(id, newRoom);
    this.chatMessages.set(id, []);
    return newRoom;
  }
  
  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    return this.chatMessages.get(roomId) || [];
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const now = new Date();
    const newMessage: ChatMessage = {
      ...message,
      id,
      createdAt: now
    };
    
    const messages = this.chatMessages.get(message.roomId) || [];
    messages.push(newMessage);
    this.chatMessages.set(message.roomId, messages);
    
    return newMessage;
  }
  
  // Bulletin operations
  async getBulletinPosts(): Promise<BulletinPost[]> {
    return Array.from(this.bulletinPosts.values());
  }
  
  async getBulletinPost(id: number): Promise<BulletinPost | undefined> {
    return this.bulletinPosts.get(id);
  }
  
  async createBulletinPost(post: InsertBulletinPost): Promise<BulletinPost> {
    const id = this.currentIds.bulletinPosts++;
    const now = new Date();
    const newPost: BulletinPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.bulletinPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBulletinPost(id: number, postData: Partial<BulletinPost>): Promise<BulletinPost | undefined> {
    const post = this.bulletinPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      ...postData,
      updatedAt: new Date()
    };
    this.bulletinPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBulletinPost(id: number): Promise<boolean> {
    return this.bulletinPosts.delete(id);
  }
  
  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentIds.orders++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      ...orderData,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId);
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentIds.subscriptions++;
    const newSubscription: Subscription = {
      ...subscription,
      id
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async updateSubscription(userId: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId);
    
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...subscriptionData };
    this.subscriptions.set(subscription.id, updatedSubscription);
    return updatedSubscription;
  }
  
  // Seed data for development
  private seedProducts() {
    const demoProducts: InsertProduct[] = [
      {
        name: "Logo T-shirt",
        description: "Comfortable cotton t-shirt with S3vn Studies logo.",
        price: 2499, // $24.99
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
        category: "Apparel",
        stock: 50,
        isNew: true,
        onSale: false,
        originalPrice: null
      },
      {
        name: "Coffee Mug",
        description: "11oz ceramic mug with S3vn Studies logo.",
        price: 1499, // $14.99
        image: "https://images.unsplash.com/photo-1531693251400-38df35776dc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
        category: "Accessories",
        stock: 30,
        isNew: false,
        onSale: false,
        originalPrice: null
      },
      {
        name: "Notebook Set",
        description: "Set of 3 premium notebooks with S3vn Studies branding.",
        price: 1999, // $19.99
        image: "https://images.unsplash.com/photo-1572502489669-22655e92cbf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        category: "Stationery",
        stock: 25,
        isNew: false,
        onSale: false,
        originalPrice: null
      },
      {
        name: "Premium Hoodie",
        description: "High-quality hoodie with embroidered S3vn Studies logo.",
        price: 3999, // $39.99
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1372&q=80",
        category: "Apparel",
        stock: 20,
        isNew: false,
        onSale: true,
        originalPrice: 4999 // $49.99
      }
    ];
    
    demoProducts.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
