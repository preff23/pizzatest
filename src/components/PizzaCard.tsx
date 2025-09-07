import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../store/cartContext';
import { HalfPizzaSelector } from './HalfPizzaSelector';
import { MENU } from '../data/menu';

interface PizzaCardProps {
  item: MenuItem;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ item }) => {
  const { add, addHalf } = useCart();
  const [showHalfSelector, setShowHalfSelector] = useState(false);

  const handleAddToCart = () => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
    });
    
    // Показываем мини-тост
    if (window.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert('Добавлено в корзину!');
    } else {
      alert('Добавлено в корзину!');
    }
  };

  const handleAddHalf = (leftId: string, rightId: string, leftName: string, rightName: string, leftPrice: number, rightPrice: number) => {
    addHalf(leftId, rightId, leftName, rightName, leftPrice, rightPrice);
    
    // Показываем мини-тост
    if (window.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert('Половинки добавлены в корзину!');
    } else {
      alert('Половинки добавлены в корзину!');
    }
  };

  return (
    <>
      <div className="card">
        <h3>{item.name}</h3>
        <div className="desc">{item.desc}</div>
        <div className="row">
          <span className="price">{item.price} ₽</span>
          <div className="card-actions">
            <button 
              className="btn btn--half"
              onClick={() => setShowHalfSelector(true)}
            >
              ½ + ½
            </button>
            <button 
              className="btn btn--primary"
              onClick={handleAddToCart}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>

      {showHalfSelector && (
        <HalfPizzaSelector
          currentPizza={item}
          allPizzas={MENU}
          onAddHalf={handleAddHalf}
          onClose={() => setShowHalfSelector(false)}
        />
      )}
    </>
  );
};
