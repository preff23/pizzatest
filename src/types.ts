export type MenuItem = {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: 'Pizza' | 'Vegan';
  tags?: string[];
};

export type CartItem = { 
  id: string; 
  name: string; 
  price: number; 
  qty: number; 
};

export type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  totalPrice: number;
  totalItems: number;
};

export type Page = 'menu' | 'cart' | 'status';

// Типы для Telegram WebApp
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebAppInitData {
  user?: TelegramUser;
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  hash?: string;
}
