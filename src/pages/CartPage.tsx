import React from 'react';
import { useCart } from '../store/cartContext';
import CurvedSection from '../components/CurvedSection';

export const CartPage: React.FC = () => {
  const { items, inc, dec, remove, clear, totalPrice } = useCart();

  const handleCheckout = async () => {
    try {
      // Получаем данные пользователя из Telegram WebApp
      const tg = (window as any).Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id;
      
      if (!userId) {
        alert('Не удалось получить данные пользователя');
        return;
      }
      
      // Отправляем запрос на сервер для создания инвойса
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          cart: {
            id: Date.now(),
            items,
            total: totalPrice
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'EMPTY_CART') {
          throw new Error('Корзина пуста. Добавьте товары в корзину.');
        } else if (error.error === 'NO_USER') {
          throw new Error('Не удалось получить данные пользователя. Попробуйте перезапустить приложение.');
        } else {
          throw new Error(error.error || 'Ошибка при отправке счета. Попробуйте еще раз.');
        }
      }
      
      // Показываем уведомление об успехе
      if (tg?.showAlert) {
        tg.showAlert('Счёт отправлен в чат. Откройте диалог с ботом, чтобы оплатить.');
      } else {
        alert('Счёт отправлен в чат. Откройте диалог с ботом, чтобы оплатить.');
      }
      
      // Тактильная обратная связь
      if (tg?.HapticFeedback?.notificationOccurred) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      
      // Очищаем корзину после успешной отправки
      clear();
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
