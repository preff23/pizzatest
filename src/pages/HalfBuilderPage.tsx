import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice } from '../types';
import Toast from '../components/Toast';
import '../styles/half-builder.css';

export const HalfBuilderPage: React.FC = () => {
  const { addHalf } = useCart();
  const [left, setLeft] = useState<typeof MENU[0] | null>(null);
  const [right, setRight] = useState<typeof MENU[0] | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalAnimation, setTotalAnimation] = useState(false);
  const prevTotalRef = useRef(0);

  const availablePizzas = useMemo(() => {
    return MENU;
  }, []);

  const total = left && right ? halfPrice(left.price, right.price) : 0;

  // Анимация изменения цены
  useEffect(() => {
    if (total !== prevTotalRef.current) {
      setTotalAnimation(true);
      const timer = setTimeout(() => setTotalAnimation(false), 160);
      prevTotalRef.current = total;
      return () => clearTimeout(timer);
    }
  }, [total]);

  const handleSideClick = (side: 'left' | 'right') => {
    setActiveSide(side);
    setShowBottomSheet(true);
  };

  const handlePick = (item: typeof MENU[0]) => {
    if (activeSide === 'left') {
      setLeft(item);
    } else {
      setRight(item);
    }
    setShowBottomSheet(false);
  };

  const handleClear = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeft(null);
    } else {
      setRight(null);
    }
  };


  const handleAddToCart = () => {
    if (left && right) {
      addHalf(
        left.id,
        right.id,
        left.name,
        right.name,
        left.price,
        right.price
      );

      const message = `Добавлено: ½ ${left.name} + ½ ${right.name} — ${total.toLocaleString('ru-RU')} ₽`;
      setToastMessage(message);

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }

      // Clear slots after adding
      setLeft(null);
      setRight(null);
    }
  };

  return (
    <div className="container">
      <div className="hb-simple">
        <div className="hb-disk-container">
          <div className="hb-disk">
            <div 
              className={`hb-slice left ${left ? 'filled' : ''}`}
              onClick={() => handleSideClick('left')}
            >
              <div className="slice-content">
                {left ? (
                  <>
                    <div className="pizza-name">{left.name}</div>
                    <button 
                      className="clear-btn"
                      onClick={(e) => { e.stopPropagation(); handleClear('left'); }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="placeholder">Выберите половинку</div>
                )}
              </div>
            </div>
            <div 
              className={`hb-slice right ${right ? 'filled' : ''}`}
              onClick={() => handleSideClick('right')}
            >
              <div className="slice-content">
                {right ? (
                  <>
                    <div className="pizza-name">{right.name}</div>
                    <button 
                      className="clear-btn"
                      onClick={(e) => { e.stopPropagation(); handleClear('right'); }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="placeholder">Выберите половинку</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hb-bottom">
          <div className={`hb-total ${totalAnimation ? 'on-total-change' : ''}`}>
            {total > 0 ? `${total.toLocaleString('ru-RU')} ₽` : ''}
          </div>
          <button 
            className="hb-add" 
            disabled={!left || !right} 
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      {showBottomSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowBottomSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3>Выберите пиццу</h3>
              <button 
                className="close-btn"
                onClick={() => setShowBottomSheet(false)}
              >
                ×
              </button>
            </div>
            <div className="bottom-sheet-content">
              {availablePizzas.map(pizza => (
                <div className="pizza-item" key={pizza.id}>
                  <div className="pizza-info">
                    <div className="pizza-name">{pizza.name}</div>
                    <div className="pizza-price">{pizza.price} ₽</div>
                  </div>
                  <button 
                    className="select-btn"
                    onClick={() => handlePick(pizza)}
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};
