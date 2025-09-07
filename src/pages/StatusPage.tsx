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
      <div className="container">
        <div className="empty-status-curved">
          <h2>Нет активных заказов</h2>
          <p>Добавьте пиццу в корзину и оформите заказ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="status-curved">
        <div className="order-status">
          <h2>Статус заказа</h2>
          <div className={`status-pill ${isPaid ? 'status-paid' : ''}`}>
            {isPaid ? 'Оплачен' : 'Ожидает оплаты'}
          </div>
        </div>

        <div className="order-items">
          <h3>Ваш заказ:</h3>
          {items.map((item) => {
            const itemId = item.kind === 'single' ? item.itemId : `${item.leftId}+${item.rightId}`;
            const isHalf = item.kind === 'half';
            
            return (
              <div key={itemId} className="order-item">
                <span className="name">
                  {item.name}
                  {isHalf && <span className="half-badge">½ + ½</span>}
                </span>
                <span className="qty">×{item.qty}</span>
                <span className="price">{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
              </div>
            );
          })}
        </div>

        <div className="status-actions">
          <button
            className="button"
            onClick={handleRepeatOrder}
          >
            Повторить прошлый заказ
          </button>
        </div>
      </div>
    </div>
  );
};
