
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  description: string;
  order_index: number;
  category: string;
  isOffer?: boolean;
  originalPrice?: number;
}

export interface Category {
  id: number;
  nombre: string;
  imagen_url?: string;
}

export interface WhatsAppContact {
  id?: number;
  name: string;
  number: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-az';

export enum UserMode {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface CarouselImage {
  id: number;
  imagen_url: string;
  orden: number;
}

export interface AdminSettings {
  whatsappNumber: string;
  whatsappContacts: WhatsAppContact[];
  companyName: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  carouselInterval?: number;
}
