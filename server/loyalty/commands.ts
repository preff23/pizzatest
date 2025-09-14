import { Telegraf, Context, Markup } from 'telegraf';
import { upsertUser, getCardByTgId } from './service';
import { cardMessage } from './ui';

export function setupUserCommands(bot: Telegraf) {
  bot.start((ctx) => showCard(ctx));
  bot.command(['card','mycard'], (ctx) => showCard(ctx));
}

async function showCard(ctx: Context) {
  const from = ctx.from!;
  const user = await upsertUser(from);
  const data = await getCardByTgId(from.id)!;

  const name = [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || `user_${from.id}`;
  const text = cardMessage(name, data.card.pizza_count, data.card.coffee_count, data.card.pizza_cycles, data.card.coffee_cycles);

  await ctx.replyWithMarkdown(text, {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback('Показать QR для начисления', `qr:${from.id}`)]
    ])
  });
}
