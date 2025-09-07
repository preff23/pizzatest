
export type PizzaItem = {
  id: string
  name: string
  price: number  // рубли, целое
  category: 'pizza' | 'vegan'
  available?: boolean
}

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

export type CartLine =
  | { kind: 'single'; itemId: string; name: string; price: number; qty: number }
  | { kind: 'half'; leftId: string; rightId: string; name: string; price: number; qty: number }

export function halfPrice(a: number, b: number) {
  // половины суммируются; округляем вверх до рубля
  return Math.ceil(a/2 + b/2)
}

export type CartContextType = {
  items: CartLine[];
  add: (item: Omit<CartItem, 'qty'>) => void;
  addHalf: (leftId: string, rightId: string, leftName: string, rightName: string, leftPrice: number, rightPrice: number) => void;
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
