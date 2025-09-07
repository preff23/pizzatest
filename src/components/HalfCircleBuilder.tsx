import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice, MenuItem } from '../types';
import Toast from './Toast';
import '../styles/half-circle.css';

type Side = 'left'|'right'

export const HalfCircleBuilder: React.FC = () => {
  const { addHalf } = useCart();
  const [activeSide, setActiveSide] = useState<Side>('left');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [left, setLeft] = useState<MenuItem|null>(null);
  const [right, setRight] = useState<MenuItem|null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [priceUpdate, setPriceUpdate] = useState(false);
  const prevTotalRef = useRef(0);

  const menuItems = useMemo(() => {
    return MENU;
  }, []);

  const total = left && right ? halfPrice(left.price, right.price) : 0;

  // Анимация обновления цены
  useEffect(() => {
    if (total !== prevTotalRef.current && total > 0) {
      setPriceUpdate(true);
      const timer = setTimeout(() => setPriceUpdate(false), 160);
      prevTotalRef.current = total;
      return () => clearTimeout(timer);
    }
  }, [total]);

  function openSheet(side: Side) { 
    setActiveSide(side); 
    setSheetOpen(true); 
  }

  function closeSheet() { 
    setSheetOpen(false); 
  }

  function choose(item: MenuItem) {
    if (activeSide === 'left') setLeft(item); 
    else setRight(item);
    setSheetOpen(false);
    if (activeSide === 'left') setActiveSide('right'); // плавный сценарий 1/2 → 2/2
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
              aria-label="Левая половинка"  
              onClick={() => openSheet('left')}
            >
              <span className="slice-label">{left?.name || 'Левая ½'}</span>
              {!!left && (
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
              aria-label="Правая половинка" 
              onClick={() => openSheet('right')}
            >
              <span className="slice-label">{right?.name || 'Правая ½'}</span>
              {!!right && (
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

        <section className="hc-cta">
          <div className={`hc-price ${priceUpdate ? 'upd' : ''}`}>
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

        {/* BottomSheet со списком пицц */}
        {sheetOpen && (
          <div className="sheet-overlay" onClick={closeSheet}>
            <div className="sheet" onClick={(e) => e.stopPropagation()}>
              <header className="sheet-head">Выберите половинку</header>
              <div className="sheet-list">
                {menuItems.map(item => (
                  <div key={item.id} className="card">
                    <h3>{item.name}</h3>
                    <div className="desc">{item.desc}</div>
                    <div className="row">
                      <span className="price">{item.price} ₽</span>
                      <button 
                        className="btn"
                        onClick={() => choose(item)}
                      >
                        Выбрать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
