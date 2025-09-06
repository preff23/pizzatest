#!/bin/bash

# Скрипт для развертывания CRUSTA MIA Telegram WebApp

echo "🍕 CRUSTA MIA - Развертывание Telegram WebApp"
echo "=============================================="

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js для продолжения."
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm для продолжения."
    exit 1
fi

echo "✅ Node.js и npm найдены"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"

# Создаем файл .env если его нет
if [ ! -f .env ]; then
    echo "📝 Создаем файл .env..."
    cp env.example .env
    echo "✅ Файл .env создан. Отредактируйте его с вашими настройками."
fi

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке проекта"
    exit 1
fi

echo "✅ Проект собран успешно"

# Показываем информацию о развертывании
echo ""
echo "🚀 Готово к развертыванию!"
echo ""
echo "📁 Файлы для загрузки находятся в папке: dist/"
echo "🌐 Загрузите содержимое папки dist/ на ваш веб-сервер"
echo "🔒 Убедитесь, что сервер поддерживает HTTPS"
echo ""
echo "📋 Следующие шаги:"
echo "1. Обновите URL в файле .env"
echo "2. Настройте WebApp в @BotFather"
echo "3. Загрузите файлы на сервер"
echo "4. Протестируйте приложение в Telegram"
echo ""
echo "📖 Подробные инструкции в файле BOT_SETUP.md"
echo ""
echo "🎉 Удачного развертывания!"
