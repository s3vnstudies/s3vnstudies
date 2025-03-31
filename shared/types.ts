export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  details: {
    last4?: string;
    brand?: string;
    email?: string;
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  createdById: number;
  isPrivate: boolean;
}

export interface WebSocketMessage {
  type: 'message' | 'join_room' | 'leave_room' | 'create_room' | 'error';
  payload: any;
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  membershipTier: string;
  createdAt: string;
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export type AdminSection = 'users' | 'content' | 'store' | 'orders' | 'bulletin' | 'settings';
