import React, { useState, useMemo } from 'react';
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


  const focusLeft = () => {
    // Focus logic for left slot
  };

  const focusRight = () => {
    // Focus logic for right slot
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
          <input 
            className="hb-search" 
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <div className="slice left">{left?.name || 'Левая ½'}</div>
            <div className="slice right">{right?.name || 'Правая ½'}</div>
          </div>

          <div className="hb-slots">
            <div className={`hb-slot ${left ? 'filled' : ''}`}>
              <div className="meta">
                <div className="label">Левая половинка</div>
                <div className="value">{left?.name || 'Выберите половинку'}</div>
              </div>
              <div className="actions">
                <button className="hb-btn" onClick={() => focusLeft()}>Изменить</button>
                {left && <button className="hb-btn" onClick={() => setLeft(null)}>Очистить</button>}
              </div>
            </div>

            <div className={`hb-slot ${right ? 'filled' : ''}`}>
              <div className="meta">
                <div className="label">Правая половинка</div>
                <div className="value">{right?.name || 'Выберите половинку'}</div>
              </div>
              <div className="actions">
                <button className="hb-btn" onClick={() => focusRight()}>Изменить</button>
                {right && <button className="hb-btn" onClick={() => setRight(null)}>Очистить</button>}
              </div>
            </div>
          </div>

          <div className="hb-total">
            <div className="muted">½ {left?.name || '—'} + ½ {right?.name || '—'}</div>
            <div className="sum">{total > 0 ? `${total.toLocaleString('ru-RU')} ₽` : ''}</div>
          </div>

          <button 
            className="hb-add" 
            disabled={!left || !right} 
            onClick={handleAddToCart}
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
