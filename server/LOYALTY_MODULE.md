# 🎫 Модуль Loyalty Card для Telegram Bot

## 📋 Описание

Модуль "Loyalty Card" (штамп-карта) для Telegram бота CRUSTA MIA. Позволяет пользователям накапливать штампы за покупки пиццы и кофе, получая каждую 6-ю позицию бесплатно.

## 🏗 Структура модуля

```
server/loyalty/
├── schema.sql      # Схема базы данных SQLite
├── db.ts          # Подключение к БД
├── service.ts     # Бизнес-логика
├── ui.ts          # UI компоненты для отображения карточек
├── commands.ts    # Пользовательские команды
└── admin.ts       # Админ-панель
```

## 🗄 База данных

### Таблицы:
- **users** - пользователи Telegram
- **loyalty** - данные лояльности (штампы, циклы)
- **transactions** - история транзакций

### Схема:
- **Пицца**: 0-5 штампов, при достижении 5 - сброс на 0 + +1 к циклам
- **Кофе**: аналогично пицце
- **Циклы**: счетчик бесплатных позиций

## 🚀 Установка и настройка

### 1. Переменные окружения

Создайте файл `.env` в папке `server/`:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_bot_token_here

# Admin Configuration (через запятую)
ADMIN_IDS=123456789,987654321

# Database Configuration
LOYA_DB_PATH=server/data/loyalty.sqlite

# Environment
NODE_ENV=development
```

### 2. Установка зависимостей

```bash
cd server
npm install
```

### 3. Запуск бота

```bash
# Разработка
npm run dev

# Продакшен
npm run build
npm start
```

## 📱 Команды пользователей

### Основные команды:
- `/start` - показать карточку лояльности
- `/card` или `/mycard` - показать карточку лояльности

### Пример карточки:
```
👤 Test User

🍕 Пицца: 3/5   ●●●○○
☕️ Кофе:  4/5   ●●●●○

_За каждые 5 — 6-я бесплатно._

🎁 Подарено: пицца ×2, кофе ×1
```

## 👨‍💼 Админ-команды

### Основные команды:
- `/admin` - открыть админ-панель
- `/add_pizza <tg_id>` - начислить штамп пиццы
- `/add_coffee <tg_id>` - начислить штамп кофе

### Примеры:
```bash
/add_pizza 123456789
/add_coffee 123456789
```

### Инлайн-кнопки:
- **🍕 +1** - начислить штамп пиццы
- **☕️ +1** - начислить штамп кофе

## 🔧 API функций

### service.ts

```typescript
// Создать/обновить пользователя
upsertUser(from: TelegramUser): Promise<User>

// Получить карточку по Telegram ID
getCardByTgId(tgId: number): Promise<{user, card} | null>

// Добавить штамп
addStamp(tgId: number, kind: 'pizza'|'coffee', admin_tg_id: number): Promise<{user, card}>

// Корректировка штампов
adjustStamp(tgId: number, kind: 'pizza'|'coffee', delta: number, admin_tg_id: number): Promise<{user, card}>
```

### ui.ts

```typescript
// Отобразить точки прогресса
renderDots(n: number): string

// Сформировать сообщение карточки
cardMessage(fullname: string, pizza: number, coffee: number, pCycles: number, cCycles: number): string
```

## 🧪 Тестирование

Запустите тестовый скрипт:

```bash
npx tsx test-loyalty.ts
```

Тест проверяет:
1. ✅ Создание пользователя
2. ✅ Получение карточки
3. ✅ Добавление штампа
4. ✅ Обновление данных

## 🔒 Безопасность

- **Админ-доступ**: только пользователи из `ADMIN_IDS`
- **Валидация**: проверка существования пользователя
- **Транзакции**: атомарные операции с БД
- **Логирование**: все действия записываются в `transactions`

## 📊 Мониторинг

### Логи транзакций:
```sql
SELECT * FROM transactions 
WHERE user_id = ? 
ORDER BY created_at DESC;
```

### Статистика пользователей:
```sql
SELECT 
  COUNT(*) as total_users,
  SUM(pizza_cycles) as total_pizza_gifts,
  SUM(coffee_cycles) as total_coffee_gifts
FROM loyalty;
```

## 🚀 Деплой

### Vercel:
1. Настройте переменные окружения в Vercel Dashboard
2. Деплой через `vercel --prod`
3. БД будет создана автоматически

### Локальный сервер:
1. Скопируйте `.env` файл
2. Запустите `npm start`
3. БД создастся в указанном пути

## 🔄 Интеграция с существующим ботом

Если у вас уже есть бот, добавьте в `server/index.ts`:

```typescript
import bot from './bot';

// Запуск бота
bot.launch();
```

## 📝 Примеры использования

### Начисление штампа админом:
```typescript
// В админ-панели
await addStamp(123456789, 'pizza', adminTgId);
```

### Получение карточки пользователя:
```typescript
const cardData = await getCardByTgId(123456789);
if (cardData) {
  const message = cardMessage(
    cardData.user.first_name,
    cardData.card.pizza_count,
    cardData.card.coffee_count,
    cardData.card.pizza_cycles,
    cardData.card.coffee_cycles
  );
}
```

## 🐛 Устранение неполадок

### Проблема: БД не создается
**Решение**: Проверьте права доступа к папке `server/data/`

### Проблема: Бот не отвечает
**Решение**: Проверьте `BOT_TOKEN` и права админа в `ADMIN_IDS`

### Проблема: Ошибки компиляции
**Решение**: Убедитесь что установлены все зависимости: `npm install`

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь в правильности переменных окружения
3. Проверьте права доступа к файлам БД

---

**Модуль готов к использованию! 🎉**
