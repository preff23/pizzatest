import React from 'react';
import { Page } from '../types';
import { useCart } from '../store/cartContext';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const IconMenu = () => (
  <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
);
const IconCart = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 4h2l2 11h11l2-8H6" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  const { items } = useCart();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  const go = (k: Page) => {
    onPageChange(k);
    (window as any).Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
    
    // Animate active line
    requestAnimationFrame(() => {
      const activeTab = document.querySelector('.tab.is-active');
      if (activeTab) {
        activeTab.classList.remove('activate');
        requestAnimationFrame(() => {
          activeTab.classList.add('activate');
        });
      }
    });
  };

  return (
    <nav className="bottom-bar" role="navigation" aria-label="Навигация">
      <button
        className={`tab ${currentPage === 'menu' ? 'is-active' : ''}`}
        onClick={() => go('menu')}
        aria-current={currentPage === 'menu' ? 'page' : undefined}
      >
        <IconMenu /><span>Меню</span>
      </button>

      <button
        className={`tab ${currentPage === 'cart' ? 'is-active' : ''}`}
        onClick={() => go('cart')}
        aria-current={currentPage === 'cart' ? 'page' : undefined}
      >
        <IconCart /><span>Корзина</span>
        {totalQty > 0 && <span className="badge">{Math.min(totalQty, 99)}</span>}
      </button>

      <button
        className={`tab ${currentPage === 'status' ? 'is-active' : ''}`}
        onClick={() => go('status')}
        aria-current={currentPage === 'status' ? 'page' : undefined}
      >
        <IconCheck /><span>Статус</span>
      </button>
    </nav>
  );
};
