// Конфигурация Telegram бота
export const BOT_CONFIG = {
  token: (import.meta as any).env?.VITE_BOT_TOKEN || '8276450519:AAElkwWgkmSOtU1aYGv_NrhPUuDT_SgAH2g',
  webAppUrl: (import.meta as any).env?.VITE_WEBAPP_URL || 'https://preff23.github.io/pizzatest',
  botUsername: (import.meta as any).env?.VITE_BOT_USERNAME || 'crusta_mia_bot',
  devMode: (import.meta as any).env?.VITE_DEV_MODE === 'true',
};

// Функция для создания ссылки на WebApp
export const createWebAppUrl = (startParam?: string) => {
  const baseUrl = `https://t.me/${BOT_CONFIG.botUsername}`;
  return startParam ? `${baseUrl}?startapp=${startParam}` : baseUrl;
};

// Функция для отправки инвойса (заглушка для будущей интеграции)
export const sendInvoice = async (chatId: string, items: any[], totalPrice: number) => {
  // TODO: Реализовать отправку инвойса через Telegram Bot API
  console.log('Sending invoice:', { chatId, items, totalPrice });
  
  // Пример использования:
  // const response = await fetch(`https://api.telegram.org/bot${BOT_CONFIG.token}/sendInvoice`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: chatId,
  //     title: 'Заказ CRUSTA MIA',
  //     description: 'Ваш заказ пиццы',
  //     payload: JSON.stringify({ orderId: Date.now() }),
  //     provider_token: 'YOUR_PROVIDER_TOKEN', // Токен платежного провайдера
  //     currency: 'RUB',
  //     prices: items.map(item => ({
  //       label: item.name,
  //       amount: item.price * item.qty * 100 // В копейках
  //     }))
  //   })
  // });
  
  return { success: true, message: 'Invoice sent successfully' };
};
