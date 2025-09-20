import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice, MenuItem } from '../types';
import Toast from './Toast';
import { HalfOptionRow } from './HalfOptionRow';
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
  const [tapEffect, setTapEffect] = useState<'left' | 'right' | null>(null);
  const [sliceFill, setSliceFill] = useState<'left' | 'right' | null>(null);
  const [priceBounce, setPriceBounce] = useState(false);
  const [buttonShine, setButtonShine] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const prevTotalRef = useRef(0);

  const menuItems = useMemo(() => {
    return MENU;
  }, []);

  const total = left && right ? halfPrice(left.price, right.price) : 0;

  // Анимация обновления цены
  useEffect(() => {
    if (total !== prevTotalRef.current && total > 0) {
      setPriceUpdate(true);
      setPriceBounce(true);
      
      const timer1 = setTimeout(() => setPriceUpdate(false), 160);
      const timer2 = setTimeout(() => setPriceBounce(false), 300);
      
      prevTotalRef.current = total;
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [total]);

  function openSheet(side: Side) { 
    setActiveSide(side); 
    setSheetOpen(true);
    
    // Tap effect
    setTapEffect(side);
    setTimeout(() => setTapEffect(null), 120);
    
    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  }

  function closeSheet() { 
    setSheetOpen(false); 
  }

  function choose(item: MenuItem) {
    if (activeSide === 'left') {
      setLeft(item);
      setSliceFill('left');
    } else {
      setRight(item);
      setSliceFill('right');
    }
    setSheetOpen(false);
    
    // Reset slice fill animation
    setTimeout(() => setSliceFill(null), 400);
    
    if (activeSide === 'left') setActiveSide('right'); // плавный сценарий 1/2 → 2/2
  }

  function addHalfToCart() {
    if (!left || !right) return;
    
    // Button shine effect
    setButtonShine(true);
    setTimeout(() => setButtonShine(false), 800);
    
    // ВАУ-эффект: летящая пицца
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
    
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
      <div className="hc-header">
        <button className="back-btn" onClick={() => window.location.href = '/'}>
          ← Назад
        </button>
      </div>
      <main className="hc">
        <h1 className="hc-title">Собери свою пиццу</h1>
        <section className="hc-visual">
          <div className="hc-disk">
            <div className={`hc-circle ${activeSide === 'left' ? 'is-left' : 'is-right'} pulse`}>
              <button 
                className={`slice left ${tapEffect === 'left' ? 'tap-effect' : ''} ${sliceFill === 'left' ? 'filled' : ''}`}
                aria-label="Левая половинка"  
                onClick={() => openSheet('left')}
              >
                <span className="slice-label">{left?.name || 'Левая ½'}</span>
              </button>
              <div className="divider" />
              <button 
                className={`slice right ${tapEffect === 'right' ? 'tap-effect' : ''} ${sliceFill === 'right' ? 'filled' : ''}`}
                aria-label="Правая половинка" 
                onClick={() => openSheet('right')}
              >
                <span className="slice-label">{right?.name || 'Правая ½'}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="hc-cta">
          <div className={`hc-price ${priceUpdate ? 'upd' : ''} ${priceBounce ? 'bounce' : ''}`}>
            {total > 0 ? `${total.toLocaleString('ru-RU')} ₽` : ''}
          </div>
          <button 
            className={`hc-add ${buttonShine ? 'shine' : ''}`}
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
                  <HalfOptionRow
                    key={item.id}
                    item={item}
                    onSelect={choose}
                  />
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

      {/* ВАУ-эффект: летящая пицца */}
      {showSuccess && (
        <div className="pizza-success">
          <div className="pizza-icon">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
      )}
    </div>
  );
};
