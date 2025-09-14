import { Telegraf } from 'telegraf';
import { setupUserCommands } from './loyalty/commands';
import { setupAdmin } from './loyalty/admin';
import { upsertUser } from './loyalty/service';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// лог простых событий
bot.use(async (ctx, next) => {
  if (ctx.from) await upsertUser(ctx.from);
  return next();
});

setupUserCommands(bot);
setupAdmin(bot);

// Если бот уже поднимается где-то в server/index.ts — подключить там bot.launch()
if (process.env.NODE_ENV !== 'production') {
  bot.launch();
  console.log('Bot started');
}

// для serverless экспортируй handler (например, vercel):
export default bot;
