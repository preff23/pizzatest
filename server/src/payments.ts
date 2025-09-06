import { LabeledPrice } from 'telegraf/types';
import { Telegraf } from 'telegraf';

const CURRENCY = process.env.PAYMENTS_CURRENCY || 'RUB';
const PROVIDER_TOKEN = process.env.TG_PROVIDER_TOKEN!;

// Простое хранилище заказов в памяти (в реальном проекте используйте БД)
const orders = new Map<number, any>();
const carts = new Map<number, any>();

function toKopecks(n: number): number { 
  return Math.round(n * 100); 
}

export function getUserCart(userId: number): any {
  return carts.get(userId) || { items: [], total: 0, id: Date.now() };
}

export function setUserCart(userId: number, cart: any): void {
  carts.set(userId, cart);
}

export function markOrderPaid(data: {
  orderId: number;
  userId: number;
  total: number;
  currency: string;
  telegramChargeId: string;
  providerChargeId: string;
}): void {
  orders.set(data.orderId, {
    ...data,
    status: 'paid',
    paidAt: new Date().toISOString()
  });
}

export function buildInvoice(userId: number, cart: any) {
  const prices: LabeledPrice[] = cart.items.map((it: any) => ({
    label: it.name,
    amount: toKopecks(it.price * it.qty || it.price)
  }));
  
  const payload = `order:${cart.id}|user:${userId}|ts:${Date.now()}`;
  
  return {
    title: 'CRUSTA MIA — заказ',
    description: `Оплата заказа #${cart.id}`,
    payload,
    provider_token: PROVIDER_TOKEN,
    currency: CURRENCY,
    prices: prices.length ? prices : [{label: 'Итого', amount: toKopecks(cart.total)}],
    start_parameter: 'crusta_checkout',
    is_flexible: false,
    need_name: false,
    need_phone_number: false,
    need_email: false,
  };
}

// Отправка инвойса пользователю
export async function sendInvoiceToUser(userId: number, cart: any, bot: Telegraf) {
  if (!cart || !cart.items?.length) {
    throw new Error('EMPTY_CART');
  }
  
  const invoice = buildInvoice(userId, cart);
  return bot.api.sendInvoice(userId, invoice);
}

// pre_checkout → разрешаем платёж (при желании сверяем сумму)
export async function onPreCheckout(ctx: any) {
  const query = ctx.update.pre_checkout_query;
  const receivedAt = new Date().toISOString();
  
  console.log('Pre-checkout query received:', {
    timestamp: receivedAt,
    queryId: query.id,
    totalAmount: query.total_amount,
    currency: query.currency,
    payload: query.invoice_payload
  });
  
  // Проверяем сумму (опционально)
  const payload = query.invoice_payload || '';
  const orderIdMatch = payload.match(/order:(\d+)/);
  const userIdMatch = payload.match(/user:(\d+)/);
  
  if (orderIdMatch && userIdMatch) {
    const orderId = Number(orderIdMatch[1]);
    const userId = Number(userIdMatch[1]);
    const savedCart = getUserCart(userId);
    
    // Проверяем, что сумма совпадает с сохраненной корзиной
    if (savedCart && savedCart.total !== query.total_amount / 100) {
      console.log('Amount mismatch detected:', {
        savedTotal: savedCart.total,
        queryTotal: query.total_amount / 100
      });
      
      const answeredAt = new Date().toISOString();
      await ctx.answerPreCheckoutQuery(false, 'Сумма изменилась. Обновите заказ.');
      console.log('Pre-checkout query answered (false):', {
        timestamp: answeredAt,
        responseTime: new Date().getTime() - new Date(receivedAt).getTime() + 'ms'
      });
      return;
    }
  }
  
  const answeredAt = new Date().toISOString();
  await ctx.answerPreCheckoutQuery(true);
  console.log('Pre-checkout query answered (true):', {
    timestamp: answeredAt,
    responseTime: new Date().getTime() - new Date(receivedAt).getTime() + 'ms'
  });
}

// Успешный платёж → помечаем заказ оплаченным
export async function onSuccessfulPayment(ctx: any) {
  const sp = ctx.message.successful_payment;
  const payload = sp.invoice_payload || '';
  
  console.log('Successful payment received:', {
    timestamp: new Date().toISOString(),
    payload,
    totalAmount: sp.total_amount,
    currency: sp.currency,
    telegramChargeId: sp.telegram_payment_charge_id,
    providerChargeId: sp.provider_payment_charge_id
  });
  
  const orderIdMatch = payload.match(/order:(\d+)/);
  const userIdMatch = payload.match(/user:(\d+)/);
  
  if (!orderIdMatch || !userIdMatch) {
    console.error('Invalid payload format:', payload);
    return;
  }
  
  const orderId = Number(orderIdMatch[1]);
  const userId = Number(userIdMatch[1]);
  
  // Проверяем, что userId совпадает
  if (ctx.from.id !== userId) {
    console.error('User ID mismatch:', ctx.from.id, userId);
    return;
  }
  
  // Проверяем, не был ли заказ уже оплачен
  const existingOrder = orders.get(orderId);
  if (existingOrder && existingOrder.status === 'paid') {
    console.log('Duplicate payment attempt detected for order:', orderId);
    await ctx.reply('Этот заказ уже был оплачен ранее. Спасибо! 🍕');
    return;
  }
  
  await markOrderPaid({
    orderId,
    userId: ctx.from.id,
    total: sp.total_amount / 100,
    currency: sp.currency,
    telegramChargeId: sp.telegram_payment_charge_id,
    providerChargeId: sp.provider_payment_charge_id
  });
  
  // Очищаем корзину пользователя
  carts.delete(userId);
  
  // Отправляем чек-сообщение
  const receiptMessage = `✅ Оплата прошла успешно!

📋 Детали заказа:
💰 Сумма: ${(sp.total_amount / 100).toLocaleString('ru-RU')} ${sp.currency}
🆔 ID платежа: ${sp.telegram_payment_charge_id}
📅 Дата: ${new Date().toLocaleString('ru-RU')}

Спасибо за заказ! Ваша пицца будет готова в течение 30-40 минут. 🍕

Приятного аппетита! 😊`;
  
  await ctx.reply(receiptMessage);
  
  console.log('Order marked as paid and receipt sent:', {
    orderId,
    userId,
    total: sp.total_amount / 100,
    currency: sp.currency
  });
}
