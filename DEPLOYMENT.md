# 🚀 Развертывание CRUSTA MIA на GitHub Pages

## Автоматическое развертывание

### 1. Настройка GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 2. Настройка GitHub Pages

1. Перейдите в **Settings** → **Pages**
2. В разделе **Source** выберите **GitHub Actions**
3. Сохраните настройки

### 3. Обновление конфигурации бота

После развертывания обновите URL в файле `src/config/bot.ts`:

```typescript
export const BOT_CONFIG = {
  token: '8276450519:AAElkwWgkmSOtU1aYGv_NrhPUuDT_SgAH2g',
  webAppUrl: 'https://preff23.github.io/pizzabot', // Ваш GitHub Pages URL
  botUsername: 'crusta_mia_bot',
  devMode: false,
};
```

### 4. Настройка WebApp в BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Введите название: `CRUSTA MIA`
5. Введите описание: `Neopolitan Pizza • Espresso Bar`
6. Введите URL: `https://preff23.github.io/pizzabot`
7. Сохраните полученную ссылку

## Ручное развертывание

### 1. Сборка проекта

```bash
npm run build
```

### 2. Загрузка на сервер

Загрузите содержимое папки `dist/` на ваш веб-сервер.

### 3. Настройка HTTPS

Убедитесь, что сервер поддерживает HTTPS (обязательно для Telegram WebApp).

## Проверка развертывания

1. Откройте URL вашего приложения
2. Проверьте работу всех функций
3. Протестируйте в Telegram на разных устройствах

## Обновление проекта

После внесения изменений:

```bash
git add .
git commit -m "Update: описание изменений"
git push origin main
```

GitHub Actions автоматически пересоберет и развернет обновленную версию.

## Troubleshooting

### Проблема: WebApp не загружается в Telegram
- Проверьте, что URL доступен по HTTPS
- Убедитесь, что сервер возвращает правильные заголовки
- Проверьте консоль браузера на ошибки

### Проблема: Не работает интеграция с ботом
- Проверьте правильность токена бота
- Убедитесь, что WebApp настроен в BotFather
- Проверьте логи в консоли браузера

---

**🎉 После настройки ваш Telegram WebApp будет доступен по адресу:**
**https://preff23.github.io/pizzabot**
