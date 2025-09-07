import React, { useState, useMemo } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice, MenuItem } from '../types';
import Toast from './Toast';
import '../styles/half-circle.css';

export const HalfCircleBuilder: React.FC = () => {
  const { addHalf } = useCart();
  const [activeSide, setActiveSide] = useState<'left'|'right'>('left');
  const [left, setLeft] = useState<MenuItem|null>(null);
  const [right, setRight] = useState<MenuItem|null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pizzaItems = useMemo(() => {
    return MENU;
  }, []);

  const total = left && right ? halfPrice(left.price, right.price) : 0;

  function setById(side: 'left'|'right', id: string) {
    const item = pizzaItems.find(p => p.id === id) || null;
    side === 'left' ? setLeft(item) : setRight(item);
    if (side === 'left') setActiveSide('right');
  }

  function openSelect(side: 'left'|'right') {
    setActiveSide(side);
    // Фокусируем соответствующий select
    setTimeout(() => {
      const selectElement = document.querySelector(`[data-side="${side}"]`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.focus();
      }
    }, 100);
  }

  function addHalfToCart() {
    if (!left || !right) return;
    
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
    
    // Очистка после добавления
    setLeft(null);
    setRight(null);
    setActiveSide('left');
  }

  return (
    <div className="container">
      <main className="hc">
        <section className="hc-visual">
          <div className={`hc-disk ${activeSide === 'left' ? 'is-left' : 'is-right'}`}>
            <button 
              className="slice left"  
              aria-label="Выбрать левую половинку"  
              onClick={() => openSelect('left')}
            >
              <span className="slice-label">{left?.name || 'Левая ½'}</span>
              {left && (
                <span 
                  className="slice-clear" 
                  onClick={(e) => { e.stopPropagation(); setLeft(null); }}
                >
                  ×
                </span>
              )}
            </button>
            <div className="divider" />
            <button 
              className="slice right" 
              aria-label="Выбрать правую половинку" 
              onClick={() => openSelect('right')}
            >
              <span className="slice-label">{right?.name || 'Правая ½'}</span>
              {right && (
                <span 
                  className="slice-clear" 
                  onClick={(e) => { e.stopPropagation(); setRight(null); }}
                >
                  ×
                </span>
              )}
            </button>
          </div>
        </section>

        <section className="hc-selects">
          <div className="hc-select">
            <label>Левая половинка</label>
            <select 
              value={left?.id || ''} 
              onChange={(e) => setById('left', e.target.value)}
              data-side="left"
            >
              <option value="">Выберите половинку</option>
              {pizzaItems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} ₽
                </option>
              ))}
            </select>
          </div>

          <div className="hc-select">
            <label>Правая половинка</label>
            <select 
              value={right?.id || ''} 
              onChange={(e) => setById('right', e.target.value)}
              data-side="right"
            >
              <option value="">Выберите половинку</option>
              {pizzaItems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} ₽
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="hc-cta">
          <div className="hc-price">
            {total > 0 ? `${total.toLocaleString('ru-RU')} ₽` : ''}
          </div>
          <button 
            className="hc-add" 
            disabled={!left || !right} 
            onClick={addHalfToCart}
          >
            Добавить в корзину
          </button>
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
