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
  const [selectedTab, setSelectedTab] = useState<'Pizza' | 'Vegan'>('Pizza');
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalAnimation, setTotalAnimation] = useState(false);
  const prevTotalRef = useRef(0);

  const availablePizzas = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category === selectedTab;
      return matchesCategory;
    });
  }, [selectedTab]);

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

  const handlePick = (item: typeof MENU[0]) => {
    if (activeSide === 'left') {
      setLeft(item);
      setActiveSide('right');
    } else {
      setRight(item);
    }
  };

  const swap = () => {
    const temp = left;
    setLeft(right);
    setRight(temp);
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
      <main className="hb">
        <aside className="hb-left">
          <div className="chips">
            <button 
              className={`chip ${selectedTab === 'Pizza' ? 'is-active' : ''}`}
              onClick={() => setSelectedTab('Pizza')}
            >
              Pizza
            </button>
            <button 
              className={`chip ${selectedTab === 'Vegan' ? 'is-active' : ''}`}
              onClick={() => setSelectedTab('Vegan')}
            >
              Vegan
            </button>
          </div>

          <div className="hb-list">
            {availablePizzas.map(pizza => (
              <div className="hb-item" key={pizza.id}>
                <div className="name">{pizza.name}</div>
                <div className="price">{pizza.price} ₽</div>
                <button className="pick" onClick={() => handlePick(pizza)}>Выбрать</button>
              </div>
            ))}
          </div>
        </aside>

        <section className="hb-right">
          <div className="hb-disk">
            <div className={`slice left ${activeSide === 'left' ? 'active' : ''}`}>
              {left?.name || 'Левая ½'}
            </div>
            <div className={`slice right ${activeSide === 'right' ? 'active' : ''}`}>
              {right?.name || 'Правая ½'}
            </div>
          </div>

          <div className="hb-slots">
            <div 
              className={`hb-slot ${activeSide === 'left' ? 'active' : ''} ${left ? 'filled' : ''}`} 
              onClick={() => setActiveSide('left')}
            >
              <div className="meta">
                <div className="label">Левая половинка</div>
                <div className="value">{left?.name || 'Выберите половинку'}</div>
              </div>
              <div className="actions">
                <button 
                  className="hb-btn" 
                  onClick={(e) => { e.stopPropagation(); swap(); }}
                >
                  Поменять местами
                </button>
                {left && (
                  <button 
                    className="hb-btn" 
                    onClick={(e) => { e.stopPropagation(); setLeft(null); }}
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>

            <div 
              className={`hb-slot ${activeSide === 'right' ? 'active' : ''} ${right ? 'filled' : ''}`} 
              onClick={() => setActiveSide('right')}
            >
              <div className="meta">
                <div className="label">Правая половинка</div>
                <div className="value">{right?.name || 'Выберите половинку'}</div>
              </div>
              <div className="actions">
                <button 
                  className="hb-btn" 
                  onClick={(e) => { e.stopPropagation(); swap(); }}
                >
                  Поменять местами
                </button>
                {right && (
                  <button 
                    className="hb-btn" 
                    onClick={(e) => { e.stopPropagation(); setRight(null); }}
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hb-sticky">
            <div className="hb-summary">½ {left?.name || '—'} + ½ {right?.name || '—'}</div>
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
        </section>
      </main>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};
