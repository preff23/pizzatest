import React from 'react';
import { useCart } from '../store/cartContext';
import { sendInvoice } from '../config/bot';
import CurvedSection from '../components/CurvedSection';

export const CartPage: React.FC = () => {
  const { items, inc, dec, remove, clear, totalPrice } = useCart();

  const handleCheckout = async () => {
    try {
      // Получаем данные пользователя из Telegram WebApp
      const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
      const chatId = user?.id?.toString();
      
      if (!chatId) {
        alert('Не удалось получить данные пользователя');
        return;
      }
      
      // Отправляем инвойс через бота
      const result = await sendInvoice(chatId, items, totalPrice);
      
      if (result.success) {
        // Показываем уведомление об успехе
        if (window.Telegram?.WebApp?.showAlert) {
          window.Telegram.WebApp.showAlert('Заказ отправлен на оплату!');
        } else {
          alert('Заказ отправлен на оплату!');
        }
        
        // Очищаем корзину после успешной отправки
        clear();
      } else {
        throw new Error('Failed to send invoice');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart-curved">
          <h2>Корзина пуста</h2>
          <p>Добавьте пиццу из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <CurvedSection>
        {items.map(item => (
          <div key={item.id} className="cart-item-curved">
            <div className="info">
              <h3 className="name">{item.name}</h3>
              <p className="price">{item.price.toLocaleString('ru-RU')} ₽</p>
            </div>
            
            <div className="controls">
              <button
                className="icon-btn"
                onClick={() => dec(item.id)}
              >
                −
              </button>
              <span className="qty">{item.qty}</span>
              <button
                className="icon-btn"
                onClick={() => inc(item.id)}
              >
                +
              </button>
              <button
                className="icon-btn"
                onClick={() => remove(item.id)}
                style={{ color: 'var(--danger)' }}
              >
                ×
              </button>
            </div>
            
            <div className="total">
              {(item.price * item.qty).toLocaleString('ru-RU')} ₽
            </div>
          </div>
        ))}
      </CurvedSection>

      <div className="cart-summary-curved">
        <div className="total">
          <span>Итого: {totalPrice.toLocaleString('ru-RU')} ₽</span>
        </div>
        
        <div className="actions">
          <button
            className="button button--clear"
            onClick={clear}
          >
            Очистить корзину
          </button>
          <button
            className="button button--checkout"
            onClick={handleCheckout}
          >
            Перейти к оплате
          </button>
        </div>
      </div>
    </div>
  );
};
