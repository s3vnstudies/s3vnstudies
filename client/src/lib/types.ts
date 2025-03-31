// User
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  membershipTier: string;
  createdAt: string;
}

export interface UserProfile extends Omit<User, 'password'> {}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  username: string; // can be username or email
  password: string;
}

// Product
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // in cents
  imageUrl: string;
  category?: string;
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

// Article
export interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: number;
  author?: UserProfile;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Chat
export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  createdBy?: number;
  isPrivate: boolean;
  createdAt: string;
  onlineUsers?: number;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  userId: number;
  message: string;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

export interface WebSocketMessage {
  type: string;
  roomId?: number;
  userId?: number;
  message?: string | ChatMessage;
  messages?: ChatMessage[];
  sender?: {
    id: number;
    username: string;
    avatar?: string;
  };
  timestamp?: string;
}

// Bulletin
export interface BulletinPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Order
export interface Order {
  id: number;
  userId: number;
  total: number; // in cents
  status: string;
  paymentIntentId?: string;
  shippingAddress?: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number; // in cents
  product?: Product;
}

// Subscription
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number; // in cents
  interval: string; // month, year
  features: string[];
  popular?: boolean;
  createdAt: string;
}

export interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  plan?: SubscriptionPlan;
}

// YouTube
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  channelId: string;
}

export interface YouTubeVideoDetails extends YouTubeVideo {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
}
