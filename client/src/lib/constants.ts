// API endpoints
export const API = {
  AUTH: {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    USER: '/api/user'
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: number) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: number) => `/api/products/${id}`,
    DELETE: (id: number) => `/api/products/${id}`
  },
  ARTICLES: {
    LIST: '/api/articles',
    DETAIL: (id: number) => `/api/articles/${id}`,
    CREATE: '/api/articles',
    UPDATE: (id: number) => `/api/articles/${id}`,
    DELETE: (id: number) => `/api/articles/${id}`
  },
  CHAT: {
    ROOMS: '/api/chat-rooms',
    ROOM_DETAIL: (id: number) => `/api/chat-rooms/${id}`,
    ROOM_MESSAGES: (roomId: number) => `/api/chat-rooms/${roomId}/messages`,
    CREATE_ROOM: '/api/chat-rooms',
    UPDATE_ROOM: (id: number) => `/api/chat-rooms/${id}`,
    DELETE_ROOM: (id: number) => `/api/chat-rooms/${id}`
  },
  BULLETIN: {
    LIST: '/api/bulletin',
    DETAIL: (id: number) => `/api/bulletin/${id}`,
    CREATE: '/api/bulletin',
    UPDATE: (id: number) => `/api/bulletin/${id}`,
    DELETE: (id: number) => `/api/bulletin/${id}`
  },
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id: number) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE_STATUS: (id: number) => `/api/orders/${id}/status`
  },
  SUBSCRIPTION: {
    PLANS: '/api/subscription-plans',
    PLAN_DETAIL: (id: number) => `/api/subscription-plans/${id}`,
    USER_SUBSCRIPTION: '/api/user-subscription',
    SUBSCRIBE: '/api/subscribe',
    CANCEL: '/api/cancel-subscription'
  },
  YOUTUBE: {
    VIDEOS: '/api/youtube/videos',
    VIDEO_DETAIL: (videoId: string) => `/api/youtube/videos/${videoId}`
  },
  PROFILE: {
    DETAIL: (username: string) => `/api/profile/${username}`,
    UPDATE: '/api/profile'
  }
};

// Membership tiers
export const MEMBERSHIP_TIERS = {
  BASIC: 'basic',
  PRO: 'pro',
  PREMIUM: 'premium',
  ADMIN: 'admin'
};

// WebSocket events
export const WS_EVENTS = {
  JOIN: 'join',
  LEAVE: 'leave',
  MESSAGE: 'message',
  SYSTEM: 'system',
  ERROR: 'error',
  HISTORY: 'history',
  PING: 'ping',
  PONG: 'pong'
};

// Routes for application pages
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ABOUT: '/about',
  ARTICLES: '/articles',
  ARTICLE_DETAIL: (id: number) => `/articles/${id}`,
  VIDEOS: '/videos',
  VIDEO_DETAIL: (id: string) => `/videos/${id}`,
  STORE: '/store',
  PRODUCT_DETAIL: (id: number) => `/store/products/${id}`,
  CHECKOUT: '/checkout',
  COMMUNITY: '/community',
  CHAT: '/community/chat',
  CHAT_ROOM: (id: number) => `/community/chat/${id}`,
  BULLETIN: '/community/bulletin',
  BULLETIN_POST: (id: number) => `/community/bulletin/${id}`,
  PROFILE: (username: string) => `/profile/${username}`,
  MEMBERSHIP: '/membership',
  ADMIN: '/admin',
  GAMES: '/games',
  POLICIES: '/policies'
};

// Content categories
export const CONTENT_CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Video', value: 'video' },
  { label: 'Article', value: 'article' },
  { label: 'Community', value: 'community' }
];

// Product categories
export const PRODUCT_CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Membership', value: 'membership' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Stationery', value: 'stationery' },
  { label: 'Digital', value: 'digital' }
];

// Mock products for development until we have real data
export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Pro Membership',
    description: 'Unlock full access to all premium content, features, and community benefits with our Pro Membership.',
    price: 299, // $2.99
    imageUrl: '/static/images/membership-promo.svg',
    category: 'membership',
    isFeatured: true,
    inStock: true
  },
  {
    id: 2,
    name: 'Premium Logo T-shirt',
    description: 'High-quality cotton t-shirt with S3VN Studies logo.',
    price: 3500, // $35.00
    imageUrl: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'apparel',
    inStock: true
  },
  {
    id: 3,
    name: 'Ceramic Coffee Mug',
    description: 'Start your day right with this premium ceramic mug.',
    price: 1800, // $18.00
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'accessories',
    inStock: true
  },
  {
    id: 4,
    name: 'Premium Notebook',
    description: '120 pages of high-quality paper for your ideas and notes.',
    price: 2200, // $22.00
    imageUrl: 'https://images.unsplash.com/photo-1572625259782-97ac450d0270?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'stationery',
    inStock: true
  },
  {
    id: 5,
    name: 'Sticker Pack',
    description: 'Set of 10 high-quality vinyl stickers with S3VN designs.',
    price: 1200, // $12.00
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'accessories',
    inStock: true
  }
];

// Sample membership plans
export const MEMBERSHIP_PLANS = [
  {
    id: 1,
    name: 'Basic',
    price: 0,
    description: 'Perfect for those who want to explore what we offer.',
    features: [
      'Access to public content',
      'Community forum access',
      'Monthly newsletter'
    ]
  },
  {
    id: 2,
    name: 'Pro',
    price: 299,
    description: 'For serious enthusiasts who want deeper engagement.',
    features: [
      'All Basic features',
      'Exclusive content access',
      'Priority support',
      'Access to all chat rooms',
      '15% discount in store',
      'Early access to new content',
      'Ability to create chat rooms'
    ],
    popular: true
  }
];

// Chat room sample data
export const DEFAULT_CHAT_ROOMS = [
  {
    id: 1,
    name: 'Beginners',
    description: 'A place for newcomers to ask questions and learn the basics',
    isPrivate: false
  },
  {
    id: 2,
    name: 'Advanced',
    description: 'Discuss advanced techniques and strategies',
    isPrivate: false
  },
  {
    id: 3,
    name: 'Q&A',
    description: 'Ask questions and get answers from the community',
    isPrivate: false
  },
  {
    id: 4,
    name: 'Lounge',
    description: 'General chat for community members',
    isPrivate: false
  }
];
