import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../store/cartContext';

interface PizzaCardProps {
  item: MenuItem;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ item }) => {
  const { add } = useCart();

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

  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p className="desc">{item.desc}</p>
      <div className="card-footer">
        <span className="price">{item.price} ₽</span>
        <button 
          className="btn-cta"
          onClick={handleAddToCart}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};
