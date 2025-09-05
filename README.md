# Калькулятор кондитерских изделий

Веб-приложение для расчета стоимости кондитерских изделий с использованием React и Django.

## Функциональность

- **Управление продуктами**: добавление, редактирование и удаление продуктов с указанием цены и единиц измерения
- **Управление рецептами**: создание рецептов с ингредиентами и расчет их стоимости
- **Настройки системы**: управление наценками и другими параметрами расчета
- **Автоматический расчет**: расчет стоимости рецептов с учетом настроек системы

## Технологии

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: React 18
- **База данных**: SQLite (для разработки)

## Установка и запуск

### Backend (Django)

1. Перейдите в папку backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
```

3. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Установите зависимости:
```bash
pip install -r ../requirements.txt
```

5. Выполните миграции:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Создайте суперпользователя (опционально):
```bash
python manage.py createsuperuser
```

7. Запустите сервер:
```bash
python manage.py runserver
```

Backend будет доступен по адресу: http://localhost:8000

### Frontend (React)

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm start
```

Frontend будет доступен по адресу: http://localhost:3000

## Использование

1. **Добавьте продукты**: В разделе "Продукты" добавьте ингредиенты с указанием цены и единиц измерения
2. **Создайте рецепты**: В разделе "Рецепты" создайте рецепты, указав необходимые ингредиенты и их количество
3. **Настройте параметры**: В разделе "Настройки" установите наценку и другие параметры расчета
4. **Рассчитайте стоимость**: Используйте кнопку "Рассчитать" для получения итоговой стоимости рецепта

## 🚀 Деплой

### Быстрый старт
```bash
# Установка зависимостей и подготовка к деплою
chmod +x deploy.sh
./deploy.sh
```

### Деплой на Vercel (Фронтенд)
1. Загрузите код в GitHub
2. Подключите репозиторий к [Vercel](https://vercel.com)
3. Установите переменную окружения: `REACT_APP_API_URL=https://your-username.pythonanywhere.com/api`
4. Деплой произойдет автоматически

### Деплой на PythonAnywhere (Бэкенд)
1. Загрузите папку `backend` на сервер
2. Создайте виртуальное окружение: `python3.10 -m venv venv`
3. Активируйте: `source venv/bin/activate`
4. Установите зависимости: `pip install -r requirements.txt`
5. Выполните миграции: `python manage.py migrate`
6. Настройте WSGI файл (см. DEPLOYMENT.md)

**Подробная инструкция**: [DEPLOYMENT.md](DEPLOYMENT.md)

## API Endpoints

- `GET /api/products/` - Список продуктов
- `POST /api/products/` - Создание продукта
- `GET /api/recipes/` - Список рецептов
- `POST /api/recipes/` - Создание рецепта
- `POST /api/recipes/{id}/calculate_cost/` - Расчет стоимости рецепта
- `GET /api/settings/` - Список настроек
- `POST /api/settings/` - Создание настройки

## Структура проекта

```
sweet/
├── backend/
│   ├── bakery_calculator/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── calculator/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   └── package.json
└── requirements.txt
```
