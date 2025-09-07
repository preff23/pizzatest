import { MenuItem } from '../types';

export const MENU: MenuItem[] = [
  // ТЕСТОВАЯ ПОЗИЦИЯ
  { id:'test-item', name:'ТЕСТОВАЯ ПОЗИЦИЯ', price:50, category:'Test',
    desc:'Тестовая позиция для проверки платежей за 50 рублей' },
  
  // PIZZA
  { id:'pepperoni', name:'ПЕППЕРОНИ', price:830, category:'Pizza',
    desc:'пепперони, моцарелла, томатный соус, базилик' },
  { id:'margarita', name:'МАРГАРИТА', price:770, category:'Pizza',
    desc:'моцарелла, томатный соус, пармезан, базилик' },
  { id:'4cheese', name:'4 СЫРА', price:830, category:'Pizza',
    desc:'моцарелла, таледжио, пармезан, горгонзола, базилик' },
  { id:'carbonara', name:'КАРБОНАРА', price:830, category:'Pizza',
    desc:'соус карбонара, бекон, моцарелла, пармезан, копчёный сыр' },
  { id:'bbq', name:'БАРБЕКЮ', price:830, category:'Pizza',
    desc:'грудинка, пепперони, бекон, моцарелла, копчёные сулугуни, соусы томатный и барбекю, зелёный лук' },
  { id:'salami', name:'САЛЯМИ', price:850, category:'Pizza',
    desc:'салями, моцарелла, шампиньоны, черри, пармезан, соус крем-чиа' },
  { id:'sea-star', name:'ЗВЕЗДА С МОРЕПРОДУКТАМИ', price:970, category:'Pizza',
    desc:'лосось, краберы, креветки, слив-том соус, артишоки, руккола, песто' },
  { id:'bresaola', name:'БРЕЗАОЛА', price:870, category:'Pizza',
    desc:'копчёная говядина, вяленые томаты, моцарелла, томаты, крем-чиа, оливки, бальзамик, базилик' },
  { id:'creamy-salmon', name:'СЛИВОЧНЫЙ ЛОСОСЬ', price:970, category:'Pizza',
    desc:'лосось, страчателла, крем-чиа, каперсы, цукини' },
  { id:'rosa', name:'ROSA DI CRUSTA', price:770, category:'Pizza',
    desc:'малина, крем-чиа, соус порту, мята' },
  { id:'strudel', name:'STRUDEL MIA', price:770, category:'Pizza',
    desc:'яблоки с корицей, изюм, ванильное мороженое, карамельный соус' },

  // VEGAN
  { id:'straccivegana', name:'STRACCIVEGANA', price:890, category:'Vegan',
    desc:'томатная основа, орегано, томат черри, сыр страчателла, оливки' },
  { id:'margarita-vegana', name:'MARGARITA VEGANA', price:890, category:'Vegan',
    desc:'томатный соус, веган-сыр (vioLife green idea), свежий базилик' },
  { id:'broccoli-vegan', name:'BROCCOLI VEGAN', price:890, category:'Vegan',
    desc:'оливковое масло вместо соуса, брокколи (отваренные или чуть обжаренные), соль/перец, пармезан сверху' },
  { id:'patata', name:'PATATA RUSTICA', price:890, category:'Vegan',
    desc:'деревенская картошка, оливковое масло с розмарином, тонкое/классическое тесто, пряные травы' }
];
