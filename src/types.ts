/**
 * AMIS Luxury Store - Core Types and Models
 */

export interface Product {
  productId: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string; // categoryId or category name
  categorySlug?: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CartItem {
  id: string; // unique item id based on productId + size + color
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  country: string;
  city: string;
  address: string;
  street?: string;
  apartment?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  postalCode: string;
  additionalInfo?: string;
}

export interface Order {
  orderId: string;
  userId?: string;
  products: CartItem[];
  items?: CartItem[];
  subtotal: number;
  shipping: number;
  shippingFee?: number;
  discount?: number;
  total: number;
  customer: OrderCustomer;
  address: ShippingAddress;
  shippingAddress?: ShippingAddress;
  shippingMethod: string;
  paymentMethod: string;
  status: OrderStatus;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  phoneNumber?: string;
  address?: ShippingAddress;
  createdAt: number;
}

export interface StoreSettings {
  storeName: string;
  logoText?: string;
  currency: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface DynamicContent {
  homepage: {
    announcement: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroButtonText: string;
    heroImage: string;
    heroSecondaryImage?: string;
    featuredTitle: string;
    newArrivalsTitle: string;
    offersTitle: string;
  };
  footer: {
    description: string;
    shippingText: string;
    returnsText: string;
  };
  pages: {
    about: string;
    contact: string;
    shipping: string;
    returns: string;
    privacy: string;
    terms: string;
    faq: { q: string; a: string }[];
  };
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'shop'; filterCategory?: string; category?: string }
  | { name: 'categories' }
  | { name: 'category'; categoryId: string }
  | { name: 'product'; productId: string }
  | { name: 'search'; initialQuery?: string; query?: string }
  | { name: 'favorites' }
  | { name: 'cart' }
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'account' }
  | { name: 'checkout' }
  | { name: 'order-success'; orderId: string }
  | { name: 'orders' }
  | { name: 'order-details'; orderId: string }
  | { name: 'tracking'; orderId?: string }
  | { name: 'order-tracking'; orderId?: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'shipping' }
  | { name: 'returns' }
  | { name: 'privacy' }
  | { name: 'terms' }
  | { name: 'faq' };
