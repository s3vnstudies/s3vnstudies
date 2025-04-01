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
  sessionStore: session.Store;
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
  
  sessionStore: session.Store;
  
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
    // Create admin user
    const adminUser: User = {
      id: this.userId++,
      username: "S3vn",
      password: "$2b$10$aCMN29PQqGWBSYCgwuIDh.LNtLX6mfoqcLj4wH0Ml1WeoHMIzYtDy", // BIGgulp25
      email: "admin@s3vnstudies.com",
      displayName: "S3vn Studies Admin",
      bio: "Administrator of S3vn Studies",
      avatarUrl: "",
      membershipTier: "free",
      memberSince: new Date(),
      isAdmin: true
    };
    this.users.set(adminUser.id, adminUser);
    
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
      name: "Premium Lounge",
      description: "Exclusive chat for premium members",
      createdBy: 1,
      isPrivate: true,
      membershipRequired: "pro"
    });

    // Create self-improvement articles
    this.createArticle({
      title: "Mastering the Growth Mindset",
      content: `
        <h2>Mastering the Growth Mindset</h2>
        <p>A growth mindset is the belief that your abilities can be developed through dedication and hard work. This perspective creates a love for learning and resilience that is essential for great accomplishment.</p>
        
        <h3>The Power of "Yet"</h3>
        <p>When you face challenges, adding the word "yet" to your statements can transform your thinking. Instead of saying "I can't do this," say "I can't do this yet." This simple change acknowledges that with persistence and effort, you can develop the skills you need.</p>
        
        <h3>Embracing Challenges</h3>
        <p>People with a growth mindset see challenges as opportunities to grow rather than threats to their self-image. They understand that stretching beyond your comfort zone is how you develop new abilities.</p>
        
        <h3>Learning from Criticism</h3>
        <p>Feedback is valuable information that can help you improve. Rather than taking criticism personally, use it as a tool to refine your approach and develop your skills.</p>
        
        <h3>Finding Inspiration in Others' Success</h3>
        <p>Instead of feeling threatened by others' achievements, see them as evidence of what's possible through dedication and hard work. Their journey can provide valuable insights for your own growth.</p>
        
        <h3>Daily Practices</h3>
        <ul>
          <li>Reflect on your learning, not just your performance</li>
          <li>Celebrate effort and progress, not just results</li>
          <li>Use setbacks as learning opportunities</li>
          <li>Seek challenges that stretch your abilities</li>
          <li>Practice positive self-talk that emphasizes growth</li>
        </ul>
        
        <p>Remember that developing a growth mindset is itself a process that requires practice and patience. Each day presents new opportunities to choose growth over limitation.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Discover how to develop a growth mindset that transforms challenges into opportunities for learning and personal development.",
      category: "self-improvement",
      membershipRequired: "free"
    });

    this.createArticle({
      title: "The Art of Effective Goal Setting",
      content: `
        <h2>The Art of Effective Goal Setting</h2>
        <p>Setting meaningful goals is a powerful process for thinking about your ideal future and motivating yourself to turn this vision into reality. When done effectively, goal setting can transform vague aspirations into concrete achievements.</p>
        
        <h3>SMART Goal Framework</h3>
        <p>The SMART framework provides a structured approach to creating goals that are more likely to be achieved:</p>
        <ul>
          <li><strong>Specific</strong>: Clearly define what you want to accomplish</li>
          <li><strong>Measurable</strong>: Include concrete criteria for measuring progress</li>
          <li><strong>Achievable</strong>: Set goals that challenge you but are attainable</li>
          <li><strong>Relevant</strong>: Ensure your goals align with your values and long-term objectives</li>
          <li><strong>Time-bound</strong>: Set a deadline to create urgency and focus</li>
        </ul>
        
        <h3>Balancing Short and Long-term Goals</h3>
        <p>Creating a hierarchy of goals helps maintain motivation while working toward distant outcomes. Consider organizing your goals into:</p>
        <ul>
          <li>Daily actions</li>
          <li>Weekly objectives</li>
          <li>Monthly milestones</li>
          <li>Yearly achievements</li>
          <li>Life vision</li>
        </ul>
        
        <h3>The Power of Written Goals</h3>
        <p>Writing down your goals creates clarity and commitment. It transforms abstract thoughts into concrete intentions. Consider keeping a dedicated journal for tracking your goals and progress.</p>
        
        <h3>Reviewing and Adjusting</h3>
        <p>Goals aren't set in stone. Schedule regular reviews to assess your progress, celebrate achievements, and adjust your approach as needed. This flexibility allows you to respond to changing circumstances while maintaining your overall direction.</p>
        
        <h3>From Goals to Habits</h3>
        <p>The most effective goals often involve creating sustainable habits. Rather than focusing exclusively on outcomes, identify the daily behaviors that will lead to your desired results.</p>
        
        <p>Remember that goal setting is a skill that improves with practice. Each goal you set and pursue provides valuable experience that enhances your ability to achieve future aspirations.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn how to set meaningful, achievable goals that propel you toward your desired future using proven strategies and frameworks.",
      category: "self-improvement",
      membershipRequired: "free"
    });

    this.createArticle({
      title: "Developing Emotional Intelligence",
      content: `
        <h2>Developing Emotional Intelligence</h2>
        <p>Emotional intelligence (EQ) is the ability to recognize, understand, and manage our own emotions while also recognizing, understanding, and influencing the emotions of others. In a world increasingly driven by connection and collaboration, EQ is often as important as technical skills.</p>
        
        <h3>The Four Pillars of Emotional Intelligence</h3>
        
        <h4>1. Self-Awareness</h4>
        <p>Self-awareness is the foundation of emotional intelligence. It involves recognizing your emotions as they arise and understanding how they affect your thoughts and behavior. Practices that enhance self-awareness include:</p>
        <ul>
          <li>Daily reflection or journaling</li>
          <li>Mindfulness meditation</li>
          <li>Seeking feedback from trusted others</li>
          <li>Identifying emotional triggers</li>
        </ul>
        
        <h4>2. Self-Management</h4>
        <p>Once you're aware of your emotions, the next step is managing them effectively. This doesn't mean suppressing feelings, but rather responding to them in constructive ways. Key self-management skills include:</p>
        <ul>
          <li>Impulse control</li>
          <li>Stress management techniques</li>
          <li>Adaptability in changing situations</li>
          <li>Maintaining a positive outlook</li>
        </ul>
        
        <h4>3. Social Awareness</h4>
        <p>Social awareness expands your emotional perception beyond yourself to understand others' feelings, needs, and concerns. This dimension includes:</p>
        <ul>
          <li>Empathy—understanding others' perspectives</li>
          <li>Organizational awareness—recognizing group dynamics</li>
          <li>Active listening skills</li>
          <li>Reading non-verbal cues</li>
        </ul>
        
        <h4>4. Relationship Management</h4>
        <p>The final component involves using emotional awareness to build healthy, productive relationships. Essential skills include:</p>
        <ul>
          <li>Clear communication</li>
          <li>Conflict resolution</li>
          <li>Inspirational leadership</li>
          <li>Collaboration and teamwork</li>
        </ul>
        
        <h3>Developing Your EQ</h3>
        <p>Unlike IQ, emotional intelligence can be significantly developed through practice. Consider these approaches:</p>
        <ul>
          <li>Practice identifying and naming emotions as they occur</li>
          <li>Pause before responding in emotional situations</li>
          <li>Ask questions to better understand others' perspectives</li>
          <li>Seek feedback about your interpersonal interactions</li>
          <li>Read literature that explores complex human emotions</li>
        </ul>
        
        <p>Remember that developing emotional intelligence is a lifelong journey. Each interaction provides an opportunity to apply and refine these skills.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1522511305405-13b8b7f2fdfb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Explore the four pillars of emotional intelligence and learn practical strategies to enhance your ability to understand and manage emotions.",
      category: "self-improvement",
      membershipRequired: "free"
    });

    this.createArticle({
      title: "The Power of Positive Habits",
      content: `
        <h2>The Power of Positive Habits</h2>
        <p>Our lives are largely determined not by our individual decisions but by our habits—the small, consistent actions we perform daily. Understanding and harnessing the power of habits can transform your life one small change at a time.</p>
        
        <h3>The Habit Loop</h3>
        <p>Habits follow a predictable pattern known as the habit loop:</p>
        <ul>
          <li><strong>Cue</strong>: The trigger that initiates the behavior</li>
          <li><strong>Craving</strong>: The motivation or desire for change</li>
          <li><strong>Response</strong>: The actual habit or action</li>
          <li><strong>Reward</strong>: The benefit you gain from the behavior</li>
        </ul>
        <p>By understanding these components, you can more effectively establish new habits and modify existing ones.</p>
        
        <h3>Making Habits Stick: The Four Laws</h3>
        <p>Research suggests four principles that can help establish positive habits:</p>
        
        <h4>1. Make it Obvious (Cue)</h4>
        <ul>
          <li>Use implementation intentions: "After [current habit], I will [new habit]."</li>
          <li>Design your environment to make cues for good habits prominent</li>
          <li>Fill out a habits scorecard to increase awareness</li>
        </ul>
        
        <h4>2. Make it Attractive (Craving)</h4>
        <ul>
          <li>Use temptation bundling—pair an action you want to do with one you need to do</li>
          <li>Join a culture where your desired behavior is the norm</li>
          <li>Create a motivation ritual before difficult habits</li>
        </ul>
        
        <h4>3. Make it Easy (Response)</h4>
        <ul>
          <li>Reduce friction for good habits; increase friction for bad ones</li>
          <li>Start with the "Two-Minute Rule"—scale habits down to two minutes or less</li>
          <li>Prepare your environment to make future actions easier</li>
        </ul>
        
        <h4>4. Make it Satisfying (Reward)</h4>
        <ul>
          <li>Use reinforcement—give yourself an immediate reward when you complete your habit</li>
          <li>Track your habits with a habit tracker</li>
          <li>Never miss twice—get back on track immediately if you slip up</li>
        </ul>
        
        <h3>Identity-Based Habits</h3>
        <p>The most effective way to change your habits is to focus on who you wish to become, not just what you want to achieve. When you make your habits part of your identity, you're more likely to stick with them. Ask yourself:</p>
        <ul>
          <li>"What would a healthy person do?"</li>
          <li>"What would a productive person do?"</li>
          <li>"What would a mindful person do?"</li>
        </ul>
        
        <p>Remember that habits are the compound interest of self-improvement. Small changes may seem insignificant in the moment, but they can deliver remarkable results over time when performed consistently.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Discover how to build positive habits that stick using science-backed strategies and the four laws of behavior change.",
      category: "self-improvement",
      membershipRequired: "free"
    });

    this.createArticle({
      title: "Mindfulness Practices for Everyday Life",
      content: `
        <h2>Mindfulness Practices for Everyday Life</h2>
        <p>Mindfulness is the practice of paying attention to the present moment with openness, curiosity, and acceptance. In our fast-paced world filled with constant stimulation and distraction, mindfulness offers a way to reconnect with ourselves and our experiences.</p>
        
        <h3>Benefits of Mindfulness</h3>
        <p>Research has shown that regular mindfulness practice can:</p>
        <ul>
          <li>Reduce stress and anxiety</li>
          <li>Improve focus and concentration</li>
          <li>Enhance emotional regulation</li>
          <li>Boost immune function</li>
          <li>Increase compassion and connection</li>
          <li>Reduce rumination and negative thinking</li>
        </ul>
        
        <h3>Simple Mindfulness Practices</h3>
        
        <h4>Mindful Breathing (5 Minutes)</h4>
        <p>One of the simplest ways to practice mindfulness is to focus on your breath:</p>
        <ol>
          <li>Find a comfortable seated position</li>
          <li>Notice the natural rhythm of your breath without changing it</li>
          <li>Feel the sensations of breathing—the rise and fall of your chest or abdomen</li>
          <li>When your mind wanders (and it will), gently bring your attention back to your breath</li>
          <li>Continue for five minutes, gradually extending the duration as you become more comfortable</li>
        </ol>
        
        <h4>Body Scan (10 Minutes)</h4>
        <p>A body scan helps you connect with physical sensations and release tension:</p>
        <ol>
          <li>Lie down or sit comfortably with your eyes closed</li>
          <li>Bring your awareness to your feet, noticing any sensations</li>
          <li>Slowly move your attention upward through each part of your body</li>
          <li>Notice areas of tension, discomfort, or ease without judgment</li>
          <li>As you become aware of tension, imagine breathing into that area and releasing it</li>
        </ol>
        
        <h4>Mindful Eating</h4>
        <p>Transform an everyday activity into a mindfulness practice:</p>
        <ol>
          <li>Before eating, pause to appreciate the appearance of your food</li>
          <li>Notice the aroma and how it affects you</li>
          <li>Take small bites and chew slowly, noticing flavors and textures</li>
          <li>Put down your utensils between bites</li>
          <li>Express gratitude for the nourishment and the many hands that brought the food to you</li>
        </ol>
        
        <h4>S.T.O.P. Practice</h4>
        <p>Use this acronym throughout your day to bring yourself back to the present moment:</p>
        <ul>
          <li><strong>S</strong>top what you're doing</li>
          <li><strong>T</strong>ake a breath</li>
          <li><strong>O</strong>bserve what's happening internally and externally</li>
          <li><strong>P</strong>roceed with awareness</li>
        </ul>
        
        <h3>Integrating Mindfulness into Daily Life</h3>
        <ul>
          <li>Start your day with a brief mindfulness practice before checking devices</li>
          <li>Use transitions (before meals, entering/leaving home) as mindfulness triggers</li>
          <li>Practice mindful listening in conversations</li>
          <li>Take mindful walking breaks, even if just for a few minutes</li>
          <li>End your day with a gratitude reflection</li>
        </ul>
        
        <p>Remember that mindfulness isn't about achieving a particular state, but rather about being aware of whatever is happening in the present moment. The essence of the practice is returning your attention again and again, cultivating awareness with kindness toward yourself.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1532798442725-41036acc7489?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn practical mindfulness techniques that can be easily integrated into your daily routine to reduce stress and increase wellbeing.",
      category: "self-improvement",
      membershipRequired: "free"
    });

    // Premium self-improvement articles (require membership)
    this.createArticle({
      title: "Advanced Meditation Techniques for Personal Growth",
      content: `
        <h2>Advanced Meditation Techniques for Personal Growth</h2>
        <p>While basic mindfulness meditation offers tremendous benefits, advanced practices can help experienced meditators break through plateaus and achieve deeper levels of awareness, insight, and personal transformation.</p>
        
        <p><strong>This premium content is available to Pro members only. Upgrade your membership to access the full article and additional exclusive content.</strong></p>
        
        <h3>What You'll Learn:</h3>
        <ul>
          <li>Vipassana meditation for developing insight and wisdom</li>
          <li>Loving-kindness (Metta) meditation for cultivating compassion</li>
          <li>Transcendental meditation techniques for deeper states of consciousness</li>
          <li>Visualization practices for manifestation and healing</li>
          <li>Integration practices to apply meditation insights to daily life</li>
        </ul>
        
        <p>Advance your meditation practice with expert guidance and transform your relationship with your mind.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Explore advanced meditation techniques that go beyond basic mindfulness to accelerate your personal growth and spiritual development.",
      category: "self-improvement",
      membershipRequired: "pro"
    });

    this.createArticle({
      title: "Mastering Difficult Conversations",
      content: `
        <h2>Mastering Difficult Conversations</h2>
        <p>Difficult conversations are an inevitable part of both personal and professional life. Whether it's delivering constructive feedback, addressing conflict, or discussing sensitive topics, these interactions often trigger strong emotions and can be challenging to navigate effectively.</p>
        
        <p><strong>This premium content is available to Pro members only. Upgrade your membership to access the full article and additional exclusive content.</strong></p>
        
        <h3>What You'll Learn:</h3>
        <ul>
          <li>A structured framework for preparing for difficult conversations</li>
          <li>Techniques for managing emotional triggers in yourself and others</li>
          <li>Powerful questioning methods that foster understanding</li>
          <li>Non-verbal communication strategies that build trust</li>
          <li>How to reach meaningful resolutions even in high-stakes situations</li>
        </ul>
        
        <p>Develop the confidence and skills to transform difficult conversations into opportunities for growth, understanding, and stronger relationships.</p>
      `,
      author: "S3vn Studies Team",
      thumbnail: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn advanced communication strategies for navigating challenging interactions with confidence, empathy, and effectiveness.",
      category: "self-improvement",
      membershipRequired: "pro"
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
      username: userData.username,
      password: userData.password,
      email: userData.email,
      displayName: userData.displayName || null,
      bio: null,
      avatarUrl: null,
      membershipTier: "free",
      memberSince: now,
      isAdmin: false
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
      "pro": 1
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
      title: articleData.title,
      content: articleData.content,
      author: articleData.author,
      excerpt: articleData.excerpt,
      category: articleData.category,
      thumbnail: articleData.thumbnail || null,
      membershipRequired: articleData.membershipRequired || "free",
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
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      imageUrl: productData.imageUrl || null,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : false
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
      "pro": 1
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
      name: roomData.name,
      createdBy: roomData.createdBy,
      description: roomData.description || null,
      isPrivate: roomData.isPrivate !== undefined ? roomData.isPrivate : false,
      membershipRequired: roomData.membershipRequired || "free",
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
      "pro": 1
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
      title: videoData.title,
      youtubeId: videoData.youtubeId,
      thumbnail: videoData.thumbnail || null,
      description: videoData.description || null,
      duration: videoData.duration || null,
      membershipRequired: videoData.membershipRequired || "free",
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
      userId: subscriptionData.userId,
      tier: subscriptionData.tier,
      startDate: now,
      endDate: subscriptionData.endDate || null,
      active: subscriptionData.active !== undefined ? subscriptionData.active : true,
      autoRenew: subscriptionData.autoRenew !== undefined ? subscriptionData.autoRenew : true
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
