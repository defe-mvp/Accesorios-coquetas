
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  description: string;
  order_index: number;
  category: string;
}

export interface Category {
  id: number;
  nombre: string;
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

export interface AdminSettings {
  whatsappNumber: string;
  companyName: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}
