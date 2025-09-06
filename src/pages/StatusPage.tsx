import React, { useState } from 'react';
import { useCart } from '../store/cartContext';

export const StatusPage: React.FC = () => {
  const { items } = useCart();
  const [isPaid] = useState(false); // TODO: Получать статус с бэкенда через API

  const handleRepeatOrder = () => {
    // TODO: Заглушка для повторения прошлого заказа
    alert('Повторить прошлый заказ');
  };

  if (items.length === 0) {
    return (
      <div className="status-page">
        <div className="empty-status">
          <h2>Нет активных заказов</h2>
          <p>Добавьте пиццу в корзину и оформите заказ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="status-page__content">
        <div className="order-status">
          <h2>Статус заказа</h2>
          <div className={`status-badge ${isPaid ? 'status-badge--paid' : 'status-badge--pending'}`}>
            {isPaid ? 'Оплачен' : 'Ожидает оплаты'}
          </div>
        </div>

        <div className="order-items">
          <h3>Ваш заказ:</h3>
          {items.map(item => (
            <div key={item.id} className="order-item">
              <span className="order-item__name">{item.name}</span>
              <span className="order-item__qty">×{item.qty}</span>
              <span className="order-item__price">{item.price * item.qty} ₽</span>
            </div>
          ))}
        </div>

        <div className="status-actions">
          <button
            className="status-actions__button"
            onClick={handleRepeatOrder}
          >
            Повторить прошлый заказ
          </button>
        </div>
      </div>
    </div>
  );
};
