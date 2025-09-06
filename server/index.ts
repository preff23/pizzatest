import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { payHandler } from './src/http/pay';
import { onPreCheckout, onSuccessfulPayment } from './src/payments';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализируем бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Регистрируем обработчики платежей
bot.on('pre_checkout_query', onPreCheckout);
bot.on('message:successful_payment', onSuccessfulPayment);

// HTTP роуты
app.post('/api/pay', payHandler);

// Статическая раздача фронтенда
app.use(express.static('dist'));

// Fallback для SPA
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: '.' });
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🍕 CRUSTA MIA Telegram WebApp готов к работе!`);
});

// Запускаем бота
bot.launch().then(() => {
  console.log('🤖 Telegram бот запущен');
}).catch((error) => {
  console.error('❌ Ошибка запуска бота:', error);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
