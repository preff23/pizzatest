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
      
      // Определяем URL сервера в зависимости от окружения
      const serverUrl = import.meta.env.VITE_SERVER_URL || 
        (import.meta.env.DEV 
          ? 'http://localhost:3001'  // Локальная разработка
          : 'https://pizzaback-one.vercel.app');  // Продакшен на Vercel
      
      // Отправляем запрос на сервер для создания инвойса
      const response = await fetch(`${serverUrl}/api/pay`, {
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
      
      // Более детальная обработка ошибок
      if (error instanceof Error) {
        alert(`Ошибка: ${error.message}`);
      } else {
        alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    }
  };

  const checkOrderStatus = async () => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id;

      if (!userId) {
        alert('Не удалось получить данные пользователя');
        return;
      }

      const serverUrl = import.meta.env.VITE_SERVER_URL || 
        (import.meta.env.DEV 
          ? 'http://localhost:3001'
          : 'https://pizzaback-one.vercel.app');

      const response = await fetch(`${serverUrl}/api/order-status?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.orders && data.orders.length > 0) {
          const lastOrder = data.orders[data.orders.length - 1];
          if (lastOrder.status === 'paid') {
            alert(`✅ Заказ #${lastOrder.orderId} оплачен!\n💰 Сумма: ${lastOrder.total} ${lastOrder.currency}\n📅 Дата: ${new Date(lastOrder.paidAt).toLocaleString('ru-RU')}`);
          } else {
            alert(`⏳ Заказ #${lastOrder.orderId} ожидает оплаты`);
          }
        } else {
          alert('📋 У вас нет заказов');
        }
      } else {
        alert('❌ Ошибка при проверке статуса заказа');
      }
    } catch (error) {
      console.error('Error checking order status:', error);
      alert('❌ Ошибка при проверке статуса заказа');
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
        {items.map((item) => {
          const itemId = item.kind === 'single' ? item.itemId : `${item.leftId}+${item.rightId}`;
          const isHalf = item.kind === 'half';
          
          return (
            <div key={itemId} className="cart-item-curved">
              <div className="info">
                <h3 className="name">
                  {item.name}
                  {isHalf && <span className="half-badge">½ + ½</span>}
                </h3>
                <p className="price">{item.price.toLocaleString('ru-RU')} ₽</p>
              </div>
              
              <div className="controls">
                <button
                  className="icon-btn"
                  onClick={() => dec(itemId)}
                >
                  −
                </button>
                <span className="qty">{item.qty}</span>
                <button
                  className="icon-btn"
                  onClick={() => inc(itemId)}
                >
                  +
                </button>
                <button
                  className="icon-btn"
                  onClick={() => remove(itemId)}
                  style={{ color: 'var(--danger)' }}
                >
                  ×
                </button>
              </div>
              
              <div className="total">
                {(item.price * item.qty).toLocaleString('ru-RU')} ₽
              </div>
            </div>
          );
        })}
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
            className="button button--secondary"
            onClick={checkOrderStatus}
          >
            Проверить статус заказа
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
