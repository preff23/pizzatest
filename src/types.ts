// базовая пицца
export type PizzaItem = {
  id: string
  name: string
  price: number // рубли целым числом
  category: 'pizza' | 'vegan'
  available?: boolean
  // future: sizes?: Array<{code:'S'|'M'|'L', price:number}>
}

// позиция корзины: целая или половинки
export type CartLine =
  | { kind: 'single', itemId: string, name: string, price: number, qty: number }
  | { kind: 'half', leftId: string, rightId: string, name: string, price: number, qty: number }

export function halfPrice(pA:number, pB:number){
  // цена считается как половины; округление вверх
  return Math.ceil(pA/2 + pB/2)
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
