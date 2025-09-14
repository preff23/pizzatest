import { Telegraf, Markup, Context } from 'telegraf';
import { addStamp, adjustStamp, getCardByTgId, upsertUser } from './service';
import { cardMessage } from './ui';

function isAdmin(ctx: Context) {
  const ids = (process.env.ADMIN_IDS || '').split(',').map(s => s.trim()).filter(Boolean).map(Number);
  return !!ctx.from && ids.includes(ctx.from.id);
}

export function setupAdmin(bot: Telegraf) {
  bot.command('admin', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('Доступ только для админов.');
    return ctx.reply('Админ-панель:', Markup.inlineKeyboard([
      [Markup.button.callback('Начислить штамп', 'ad:add')],
      [Markup.button.callback('Корректировка', 'ad:adjust')]
    ]));
  });

  // Начисление штампа: бот попросит прислать @username или переслать сообщение пользователя
  bot.action('ad:add', async (ctx) => {
    if (!isAdmin(ctx)) return;
    await ctx.answerCbQuery();
    await ctx.reply('Пришлите @username пользователя (или пересланное сообщение). Затем отправьте `+pizza` или `+coffee`.');
    (ctx as any).session = { mode: 'add' };
  });

  // Упрощаем: отдельные команды начисления
  bot.hears(/^\/add_pizza\s+(\d+)/, async (ctx) => {
    if (!isAdmin(ctx)) return;
    const tgId = Number(ctx.match[1]);
    try {
      const data = await addStamp(tgId, 'pizza', ctx.from!.id);
      await ctx.reply(renderCardForAdmin(data));
    } catch (error) {
      await ctx.reply('Пользователь не найден');
    }
  });

  bot.hears(/^\/add_coffee\s+(\d+)/, async (ctx) => {
    if (!isAdmin(ctx)) return;
    const tgId = Number(ctx.match[1]);
    try {
      const data = await addStamp(tgId, 'coffee', ctx.from!.id);
      await ctx.reply(renderCardForAdmin(data));
    } catch (error) {
      await ctx.reply('Пользователь не найден');
    }
  });

  // Быстрые кнопки прямо под карточкой пользователя
  bot.action(/manage:(\d+)/, async (ctx) => {
    if (!isAdmin(ctx)) return;
    const tgId = Number(ctx.match[1]);
    const data = await getCardByTgId(tgId);
    if (!data) return ctx.answerCbQuery('Пользователь не найден');
    await ctx.editMessageText(renderCardForAdmin(data), {
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback('🍕 +1', `inc:pizza:${tgId}`),
          Markup.button.callback('☕️ +1', `inc:coffee:${tgId}`)
        ]
      ])
    });
  });

  bot.action(/inc:(pizza|coffee):(\d+)/, async (ctx) => {
    if (!isAdmin(ctx)) return;
    const kind = ctx.match[1] as 'pizza'|'coffee';
    const tgId = Number(ctx.match[2]);
    try {
      const data = await addStamp(tgId, kind, ctx.from!.id);
      await ctx.editMessageText(renderCardForAdmin(data), {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback('🍕 +1', `inc:pizza:${tgId}`),
            Markup.button.callback('☕️ +1', `inc:coffee:${tgId}`)
          ]
        ])
      });
      await ctx.answerCbQuery(kind === 'pizza' ? 'Начислена 1 пицца' : 'Начислен 1 кофе');
    } catch (error) {
      await ctx.answerCbQuery('Ошибка начисления');
    }
  });
}

function renderCardForAdmin(d: ReturnType<typeof getCardByTgId> & any) {
  const u = d.user;
  const c = d.card;
  const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || `user_${u.tg_id}`;
  return cardMessage(name, c.pizza_count, c.coffee_count, c.pizza_cycles, c.coffee_cycles);
}
