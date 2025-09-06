import type { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import { sendInvoiceToUser, getUserCart, setUserCart } from '../payments';

// Создаем экземпляр бота для отправки инвойсов
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export async function payHandler(req: Request, res: Response) {
  try {
    // userId достанем из initData мини-аппа (передаём с фронта)
    const { userId, cart } = req.body;
    
    console.log('Pay request received:', { userId, cartItems: cart?.items?.length, cartTotal: cart?.total });
    
    if (!userId) {
      return res.status(400).json({ ok: false, error: 'NO_USER' });
    }
    
    if (!cart || !cart.items || !cart.items.length) {
      return res.status(400).json({ ok: false, error: 'EMPTY_CART' });
    }
    
    // Сохраняем корзину пользователя
    setUserCart(Number(userId), cart);
    
    await sendInvoiceToUser(Number(userId), cart, bot);
    res.json({ ok: true });
  } catch (e: any) {
    console.error('Error in payHandler:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
