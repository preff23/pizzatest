import React, { useState, useMemo } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice } from '../types';
import Toast from '../components/Toast';

export const HalfBuilderPage: React.FC = () => {
  const { addHalf } = useCart();
  const [left, setLeft] = useState<typeof MENU[0] | null>(null);
  const [right, setRight] = useState<typeof MENU[0] | null>(null);
  const [selectedTab, setSelectedTab] = useState<'Pizza' | 'Vegan'>('Pizza');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availablePizzas = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category === selectedTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedTab, searchQuery]);

  const total = left && right ? halfPrice(left.price, right.price) : 0;

  const handlePick = (item: typeof MENU[0]) => {
    if (!left) {
      setLeft(item);
    } else if (!right) {
      setRight(item);
    } else {
      setLeft(item); // Replace left slot
    }
  };

  const handleClearSlot = (slot: 'left' | 'right') => {
    if (slot === 'left') {
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
      <h2 className="section-title">СОБРАТЬ ½ + ½</h2>
      <div className="section-rule"></div>
      
      <div className="half-builder">
        {/* Left Panel - Pizza Selection */}
        <div className="half-builder-left">
          <div className="half-builder-filters">
            <div className="filter-chips">
              <button 
                className={`filter-chip ${selectedTab === 'Pizza' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Pizza')}
              >
                Pizza
              </button>
              <button 
                className={`filter-chip ${selectedTab === 'Vegan' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Vegan')}
              >
                Vegan
              </button>
            </div>
            <input 
              className="search-input" 
              placeholder="Поиск пиццы"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="pizza-list">
            {availablePizzas.map(pizza => (
              <div key={pizza.id} className="pizza-item">
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

        {/* Right Panel - Preview and Controls */}
        <div className="half-builder-right">
          <div className="pizza-preview">
            <div className="pizza-disk">
              <div className="pizza-slice left">
                {left?.name || 'Левая ½'}
              </div>
              <div className="pizza-slice right">
                {right?.name || 'Правая ½'}
              </div>
            </div>
          </div>

          <div className="pizza-slots">
            <div className={`pizza-slot ${left ? 'filled' : ''}`}>
              <div className="slot-info">
                <div className="slot-label">Левая ½</div>
                <div className="slot-name">
                  {left?.name || 'Выберите половинку'}
                </div>
                {left && (
                  <div className="slot-price">{left.price} ₽</div>
                )}
              </div>
              {left && (
                <button 
                  className="clear-btn"
                  onClick={() => handleClearSlot('left')}
                >
                  ×
                </button>
              )}
            </div>

            <div className={`pizza-slot ${right ? 'filled' : ''}`}>
              <div className="slot-info">
                <div className="slot-label">Правая ½</div>
                <div className="slot-name">
                  {right?.name || 'Выберите половинку'}
                </div>
                {right && (
                  <div className="slot-price">{right.price} ₽</div>
                )}
              </div>
              {right && (
                <button 
                  className="clear-btn"
                  onClick={() => handleClearSlot('right')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="total-section">
            <div className="total-label">Итого:</div>
            <div className="total-price">{total.toLocaleString('ru-RU')} ₽</div>
          </div>

          <button 
            className={`add-to-cart-btn ${left && right ? 'active' : 'disabled'}`}
            disabled={!(left && right)}
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
        </div>
      </div>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};
