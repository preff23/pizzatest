import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types';

type CartAction = 
  | { type: 'ADD'; payload: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE'; payload: string }
  | { type: 'INC'; payload: string }
  | { type: 'DEC'; payload: string }
  | { type: 'CLEAR' };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD': {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    case 'INC':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    case 'DEC':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, qty: Math.max(0, item.qty - 1) }
          : item
      ).filter(item => item.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  const add = (item: Omit<CartItem, 'qty'>) => {
    dispatch({ type: 'ADD', payload: item });
  };

  const remove = (id: string) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const inc = (id: string) => {
    dispatch({ type: 'INC', payload: id });
  };

  const dec = (id: string) => {
    dispatch({ type: 'DEC', payload: id });
  };

  const clear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const value: CartContextType = {
    items,
    add,
    remove,
    inc,
    dec,
    clear,
    totalPrice,
    totalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
