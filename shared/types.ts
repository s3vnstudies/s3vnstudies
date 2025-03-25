export type MembershipTier = 'free' | 'standard' | 'premium';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';

export type UserRole = 'user' | 'admin';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItem extends OrderItem {
  imageUrl: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export interface ChatRoomUser {
  id: number;
  username: string;
  avatarUrl?: string;
}
