import React from 'react';
import { useCart } from '../store/cartContext';
import { sendInvoice } from '../config/bot';

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
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Корзина пуста</h2>
          <p>Добавьте пиццу из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__price">{item.price} ₽</p>
              </div>
              
              <div className="cart-item__controls">
                <button
                  className="cart-item__button cart-item__button--dec"
                  onClick={() => dec(item.id)}
                >
                  −
                </button>
                <span className="cart-item__qty">{item.qty}</span>
                <button
                  className="cart-item__button cart-item__button--inc"
                  onClick={() => inc(item.id)}
                >
                  +
                </button>
                <button
                  className="cart-item__button cart-item__button--remove"
                  onClick={() => remove(item.id)}
                >
                  ×
                </button>
              </div>
              
              <div className="cart-item__total">
                {item.price * item.qty} ₽
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__total">
            <span>Итого: {totalPrice} ₽</span>
          </div>
          
          <div className="cart-summary__actions">
            <button
              className="cart-summary__button cart-summary__button--clear"
              onClick={clear}
            >
              Очистить корзину
            </button>
            <button
              className="cart-summary__button cart-summary__button--checkout"
              onClick={handleCheckout}
            >
              Перейти к оплате
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
