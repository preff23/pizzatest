export function renderDots(n: number) {
  // 5 позиций: ● (заполнена) ○ (пусто)
  return '●'.repeat(n) + '○'.repeat(5 - n);
}

export function cardMessage(fullname: string, pizza: number, coffee: number, pCycles: number, cCycles: number) {
  return [
    `👤 *${fullname}*`,
    `\n🍕 Пицца: *${pizza}/5*   ${renderDots(pizza)}`,
    `☕️ Кофе:  *${coffee}/5*  ${renderDots(coffee)}`,
    '',
    `_За каждые 5 — 6-я бесплатно._`,
    pCycles > 0 || cCycles > 0 ? `\n🎁 Подарено: пицца ×${pCycles}, кофе ×${cCycles}` : ''
  ].join('\n');
}
