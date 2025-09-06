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
export async function sendInvoiceToUser(userId: number, bot: Telegraf) {
  const cart = getUserCart(userId);
  if (!cart || !cart.items?.length) {
    throw new Error('EMPTY_CART');
  }
  
  const invoice = buildInvoice(userId, cart);
  return bot.api.sendInvoice(userId, invoice);
}

// pre_checkout → разрешаем платёж (при желании сверяем сумму)
export async function onPreCheckout(ctx: any) {
  console.log('Pre-checkout query received:', ctx.update.pre_checkout_query);
  
  // Тут можно проверить сумму/позиции по ctx.update.pre_checkout_query
  // const query = ctx.update.pre_checkout_query;
  // const totalAmount = query.total_amount;
  // const currency = query.currency;
  
  await ctx.answerPreCheckoutQuery(true);
}

// Успешный платёж → помечаем заказ оплаченным
export async function onSuccessfulPayment(ctx: any) {
  const sp = ctx.message.successful_payment;
  const payload = sp.invoice_payload || '';
  
  console.log('Successful payment received:', {
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
  
  await ctx.reply('Оплата прошла успешно. Спасибо! 🍕');
}
