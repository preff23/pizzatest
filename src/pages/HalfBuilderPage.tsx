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
      <div className="hb">
        {/* Left Panel - Pizza Selection */}
        <div className="hb-left">
          <div className="hb-filters">
            <div className="hb-chips">
              <button 
                className={`hb-chip ${selectedTab === 'Pizza' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Pizza')}
              >
                Pizza
              </button>
              <button 
                className={`hb-chip ${selectedTab === 'Vegan' ? 'active' : ''}`}
                onClick={() => setSelectedTab('Vegan')}
              >
                Vegan
              </button>
            </div>
            <input 
              className="hb-search" 
              placeholder="Поиск пиццы"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="hb-list">
            {availablePizzas.map(pizza => (
              <div key={pizza.id} className="hb-item">
                <div className="hb-item-info">
                  <div className="hb-item-name">{pizza.name}</div>
                  <div className="hb-item-price">{pizza.price} ₽</div>
                </div>
                <button 
                  className="hb-pick-btn"
                  onClick={() => handlePick(pizza)}
                >
                  Выбрать
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Preview and Controls */}
        <div className="hb-right">
          <div className="hb-preview">
            <div className="hb-disk">
              <div className="hb-slice left">
                {left?.name || 'Левая ½'}
              </div>
              <div className="hb-slice right">
                {right?.name || 'Правая ½'}
              </div>
            </div>
          </div>

          <div className="hb-slots">
            <div className="hb-slot">
              <div className="hb-slot-info">
                <div className="hb-slot-label">Левая ½</div>
                <div className="hb-slot-name">
                  {left?.name || 'Выберите половинку'}
                </div>
                {left && (
                  <div className="hb-slot-price">{left.price} ₽</div>
                )}
              </div>
              {left && (
                <button 
                  className="hb-clear-btn"
                  onClick={() => handleClearSlot('left')}
                >
                  Очистить
                </button>
              )}
            </div>

            <div className="hb-slot">
              <div className="hb-slot-info">
                <div className="hb-slot-label">Правая ½</div>
                <div className="hb-slot-name">
                  {right?.name || 'Выберите половинку'}
                </div>
                {right && (
                  <div className="hb-slot-price">{right.price} ₽</div>
                )}
              </div>
              {right && (
                <button 
                  className="hb-clear-btn"
                  onClick={() => handleClearSlot('right')}
                >
                  Очистить
                </button>
              )}
            </div>
          </div>

          <div className="hb-total">
            <div className="hb-total-label">Итого:</div>
            <div className="hb-total-price">{total.toLocaleString('ru-RU')} ₽</div>
          </div>

          <button 
            className="hb-add"
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
