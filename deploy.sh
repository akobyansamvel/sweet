#!/bin/bash

echo "🚀 Подготовка к деплою..."

# Проверяем, что мы в корневой директории проекта
if [ ! -f "requirements.txt" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой директории проекта"
    exit 1
fi

echo "📦 Установка зависимостей для бэкенда..."
cd backend
pip install -r ../requirements.txt

echo "🗄️ Выполнение миграций..."
python manage.py makemigrations
python manage.py migrate

echo "📁 Сбор статических файлов..."
python manage.py collectstatic --noinput

echo "🔧 Создание суперпользователя (если нужно)..."
echo "Хотите создать суперпользователя? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

cd ..

echo "📦 Установка зависимостей для фронтенда..."
cd frontend
npm install

echo "🏗️ Сборка фронтенда..."
npm run build

cd ..

echo "✅ Готово к деплою!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Загрузите папку 'backend' на PythonAnywhere"
echo "2. Загрузите папку 'frontend' на Vercel"
echo "3. Настройте переменные окружения"
echo "4. Обновите CORS настройки"
echo ""
echo "📖 Подробная инструкция в файле DEPLOYMENT.md"
