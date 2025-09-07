import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartLine, CartContextType, halfPrice } from '../types';

type CartAction = 
  | { type: 'ADD'; payload: { itemId: string; name: string; price: number } }
  | { type: 'ADD_HALF'; payload: { leftId: string; rightId: string; leftName: string; rightName: string; leftPrice: number; rightPrice: number } }
  | { type: 'REMOVE'; payload: string }
  | { type: 'INC'; payload: string }
  | { type: 'DEC'; payload: string }
  | { type: 'CLEAR' };

const cartReducer = (state: CartLine[], action: CartAction): CartLine[] => {
  switch (action.type) {
    case 'ADD': {
      const existingItem = state.find(item => 
        item.kind === 'single' && item.itemId === action.payload.itemId
      );
      if (existingItem && existingItem.kind === 'single') {
        return state.map(item =>
          item.kind === 'single' && item.itemId === action.payload.itemId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { 
        kind: 'single', 
        itemId: action.payload.itemId, 
        name: action.payload.name, 
        price: action.payload.price, 
        qty: 1 
      }];
    }
    case 'ADD_HALF': {
      const existingHalf = state.find(item => 
        item.kind === 'half' && 
        item.leftId === action.payload.leftId && 
        item.rightId === action.payload.rightId
      );
      if (existingHalf && existingHalf.kind === 'half') {
        return state.map(item =>
          item.kind === 'half' && 
          item.leftId === action.payload.leftId && 
          item.rightId === action.payload.rightId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, {
        kind: 'half',
        leftId: action.payload.leftId,
        rightId: action.payload.rightId,
        name: `${action.payload.leftName} + ${action.payload.rightName}`,
        price: halfPrice(action.payload.leftPrice, action.payload.rightPrice),
        qty: 1
      }];
    }
    case 'REMOVE':
      return state.filter(item => {
        if (item.kind === 'single') {
          return item.itemId !== action.payload;
        } else {
          return `${item.leftId}+${item.rightId}` !== action.payload;
        }
      });
    case 'INC':
      return state.map(item => {
        if (item.kind === 'single' && item.itemId === action.payload) {
          return { ...item, qty: item.qty + 1 };
        } else if (item.kind === 'half' && `${item.leftId}+${item.rightId}` === action.payload) {
          return { ...item, qty: item.qty + 1 };
        }
        return item;
      });
    case 'DEC':
      return state.map(item => {
        if (item.kind === 'single' && item.itemId === action.payload) {
          return { ...item, qty: Math.max(0, item.qty - 1) };
        } else if (item.kind === 'half' && `${item.leftId}+${item.rightId}` === action.payload) {
          return { ...item, qty: Math.max(0, item.qty - 1) };
        }
        return item;
      }).filter(item => item.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  const add = (item: { id: string; name: string; price: number }) => {
    dispatch({ type: 'ADD', payload: { itemId: item.id, name: item.name, price: item.price } });
  };

  const addHalf = (leftId: string, rightId: string, leftName: string, rightName: string, leftPrice: number, rightPrice: number) => {
    dispatch({ 
      type: 'ADD_HALF', 
      payload: { leftId, rightId, leftName, rightName, leftPrice, rightPrice } 
    });
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
    addHalf,
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
