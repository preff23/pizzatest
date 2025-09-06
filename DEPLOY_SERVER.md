# Развертывание сервера CRUSTA MIA на Vercel

## 🎯 Проблема
Фронтенд развернут на `https://pizzatest-orcin.vercel.app`, но серверная часть не развернута. 
Фронтенд пытается обратиться к `/api/pay`, но получает ошибку "Попробуйте еще раз".

## ✅ Решение

### 1. Создать отдельный репозиторий для сервера
```bash
# Создать новый репозиторий на GitHub
# Название: crusta-mia-server
# Описание: Backend server for CRUSTA MIA Telegram WebApp
```

### 2. Скопировать серверные файлы
```bash
# Скопировать папку server/ в новый репозиторий
# Структура:
crusta-mia-server/
├── index.ts          # Основной файл сервера
├── src/
│   ├── payments.ts   # Логика платежей
│   └── http/
│       └── pay.ts    # HTTP эндпоинт
├── package.json      # Зависимости
├── tsconfig.json     # TypeScript конфиг
├── vercel.json       # Конфигурация Vercel
└── .env.example      # Пример переменных окружения
```

### 3. Настроить Vercel для сервера
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.ts"
    }
  ],
  "env": {
    "TELEGRAM_BOT_TOKEN": "@telegram_bot_token",
    "TG_PROVIDER_TOKEN": "@tg_provider_token",
    "PAYMENTS_CURRENCY": "RUB"
  }
}
```

### 4. Обновить переменные окружения
В настройках Vercel добавить:
- `TELEGRAM_BOT_TOKEN`: `8276450519:AAElkwWgkmSOtU1aYGv_NrhPUuDT_SgAH2g`
- `TG_PROVIDER_TOKEN`: `1744374395:TEST:337495814f69076f8fcb`
- `PAYMENTS_CURRENCY`: `RUB`

### 5. Обновить фронтенд
После развертывания сервера обновить URL в `src/pages/CartPage.tsx`:
```typescript
const serverUrl = import.meta.env.VITE_SERVER_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:3001'
    : 'https://crusta-mia-server.vercel.app');  // Заменить на реальный URL
```

## 🚀 Пошаговый план

### Шаг 1: Создать репозиторий сервера
1. Перейти на GitHub
2. Создать новый репозиторий `crusta-mia-server`
3. Склонировать локально

### Шаг 2: Подготовить файлы сервера
1. Скопировать содержимое папки `server/`
2. Создать `vercel.json`
3. Обновить `package.json` для Vercel

### Шаг 3: Развернуть на Vercel
1. Подключить репозиторий к Vercel
2. Настроить переменные окружения
3. Получить URL сервера

### Шаг 4: Обновить фронтенд
1. Обновить URL сервера в коде
2. Задеплоить обновленный фронтенд

## 📋 Файлы для создания

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.ts"
    }
  ]
}
```

### package.json (обновленный)
```json
{
  "name": "crusta-mia-server",
  "version": "1.0.0",
  "description": "Backend server for CRUSTA MIA Telegram WebApp",
  "main": "index.ts",
  "scripts": {
    "dev": "tsx watch index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "telegraf": "^4.15.6",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "tsx": "^4.6.2",
    "typescript": "^5.3.3"
  }
}
```

## 🎯 Результат
После выполнения всех шагов:
- Фронтенд: `https://pizzatest-orcin.vercel.app`
- Сервер: `https://crusta-mia-server.vercel.app`
- API: `https://crusta-mia-server.vercel.app/api/pay`

Ошибка "Попробуйте еще раз" исчезнет!
