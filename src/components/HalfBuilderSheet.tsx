import React, { useState, useMemo } from 'react';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';
import { halfPrice } from '../types';

interface HalfBuilderSheetProps {
  onClose: () => void;
}

export const HalfBuilderSheet: React.FC<HalfBuilderSheetProps> = ({ onClose }) => {
  const { addHalf } = useCart();
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [leftPrice, setLeftPrice] = useState(0);
  const [rightPrice, setRightPrice] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'pizza' | 'vegan'>('pizza');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFocused, setLastFocused] = useState<'left' | 'right'>('left');

  const availablePizzas = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category.toLowerCase() === selectedTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedTab, searchQuery]);

  const leftPizza = leftId ? MENU.find(p => p.id === leftId) : null;
  const rightPizza = rightId ? MENU.find(p => p.id === rightId) : null;
  const total = halfPrice(leftPrice, rightPrice);

  const handlePizzaSelect = (pizza: typeof MENU[0]) => {
    if (!leftId) {
      setLeftId(pizza.id);
      setLeftPrice(pizza.price);
      setLastFocused('left');
    } else if (!rightId) {
      setRightId(pizza.id);
      setRightPrice(pizza.price);
      setLastFocused('right');
    } else {
      // Replace the last focused side
      if (lastFocused === 'left') {
        setLeftId(pizza.id);
        setLeftPrice(pizza.price);
      } else {
        setRightId(pizza.id);
        setRightPrice(pizza.price);
      }
    }
  };

  const handleSideClick = (side: 'left' | 'right') => {
    setLastFocused(side);
  };

  const handleAddToCart = () => {
    if (leftId && rightId && leftPizza && rightPizza) {
      addHalf(
        leftId,
        rightId,
        leftPizza.name,
        rightPizza.name,
        leftPrice,
        rightPrice
      );

      // Show toast
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Добавлено: ½ ${leftPizza.name} + ½ ${rightPizza.name} — ${total} ₽`);
      } else {
        alert(`Добавлено: ½ ${leftPizza.name} + ½ ${rightPizza.name} — ${total} ₽`);
      }

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }

      onClose();
    }
  };

  return (
    <div className="half-builder-sheet">
      <header className="hb-head">
        <div className="hb-title">Собрать ½ + ½</div>
        <button className="hb-close" onClick={onClose}>Закрыть</button>
      </header>

      <section className="hb-preview">
        <div className="hb-disk">
          <div 
            className={`slice left ${lastFocused === 'left' ? 'active' : ''}`}
            onClick={() => handleSideClick('left')}
          >
            {leftPizza?.name || 'Левая ½'}
          </div>
          <div 
            className={`slice right ${lastFocused === 'right' ? 'active' : ''}`}
            onClick={() => handleSideClick('right')}
          >
            {rightPizza?.name || 'Правая ½'}
          </div>
        </div>
      </section>

      <section className="hb-pick">
        <div className="chips">
          <button 
            className={`chip ${selectedTab === 'pizza' ? 'active' : ''}`}
            onClick={() => setSelectedTab('pizza')}
          >
            Pizza
          </button>
          <button 
            className={`chip ${selectedTab === 'vegan' ? 'active' : ''}`}
            onClick={() => setSelectedTab('vegan')}
          >
            Vegan
          </button>
          <input 
            className="hb-search" 
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="hb-list">
          {availablePizzas.map(pizza => (
            <div key={pizza.id} className="item">
              <div className="name">{pizza.name}</div>
              <div className="price">{pizza.price} ₽</div>
              <button 
                className="pick"
                onClick={() => handlePizzaSelect(pizza)}
              >
                Выбрать
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="hb-footer">
        <div className="hb-summary">
          ½ {leftPizza?.name || '—'} + ½ {rightPizza?.name || '—'}
        </div>
        <div className="hb-price">{total} ₽</div>
        <button 
          className="hb-add" 
          disabled={!(leftId && rightId)}
          onClick={handleAddToCart}
        >
          Добавить в корзину
        </button>
      </footer>
    </div>
  );
};
