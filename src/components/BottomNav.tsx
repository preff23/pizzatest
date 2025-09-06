import React from 'react';
import { Page } from '../types';
import { useCart } from '../store/cartContext';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  const { totalItems } = useCart();

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav__item ${currentPage === 'menu' ? 'active' : ''}`}
        onClick={() => onPageChange('menu')}
      >
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
        <span>Меню</span>
      </button>
      
      <button
        className={`bottom-nav__item ${currentPage === 'cart' ? 'active' : ''}`}
        onClick={() => onPageChange('cart')}
      >
        <div className="bottom-nav__cart-wrapper">
          <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
          </svg>
          {totalItems > 0 && (
            <span className="bottom-nav__badge">{totalItems}</span>
          )}
        </div>
        <span>Корзина</span>
      </button>
      
      <button
        className={`bottom-nav__item ${currentPage === 'status' ? 'active' : ''}`}
        onClick={() => onPageChange('status')}
      >
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Статус</span>
      </button>
    </nav>
  );
};
