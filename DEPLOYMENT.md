# Деплой на Vercel и PythonAnywhere

## 🚀 Деплой фронтенда на Vercel

### 1. Подготовка
1. Убедитесь, что у вас есть аккаунт на [Vercel](https://vercel.com)
2. Установите Vercel CLI: `npm i -g vercel`

### 2. Настройка переменных окружения
В панели Vercel добавьте переменную:
- `REACT_APP_API_URL` = `https://your-username.pythonanywhere.com/api`

### 3. Деплой через CLI
```bash
cd frontend
vercel --prod
```

### 4. Деплой через GitHub
1. Загрузите код в GitHub репозиторий
2. Подключите репозиторий к Vercel
3. Установите переменные окружения в настройках проекта
4. Деплой произойдет автоматически

## 🐍 Деплой бэкенда на PythonAnywhere

### 1. Подготовка
1. Создайте аккаунт на [PythonAnywhere](https://pythonanywhere.com)
2. Создайте новый веб-приложение

### 2. Загрузка кода
1. Загрузите папку `backend` в домашнюю директорию
2. Или используйте Git: `git clone your-repo`

### 3. Настройка виртуального окружения
```bash
cd ~/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Настройка базы данных
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 5. Настройка WSGI файла
Создайте файл `/var/www/your-username_pythonanywhere_com_wsgi.py`:
```python
import os
import sys

path = '/home/your-username/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'bakery_calculator.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 6. Настройка статических файлов
В настройках веб-приложения:
- URL: `/static/`
- Directory: `/home/your-username/backend/static/`

### 7. Настройка CORS
Обновите `ALLOWED_HOSTS` в `settings.py`:
```python
ALLOWED_HOSTS = ['your-username.pythonanywhere.com', 'localhost']
```

## 🔧 Настройка для продакшена

### Переменные окружения для PythonAnywhere
Создайте файл `.env` в папке `backend`:
```
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-username.pythonanywhere.com
```

### Обновление settings.py для продакшена
```python
import os
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# CORS настройки для продакшена
CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-app.vercel.app",
    "http://localhost:3000",
]
```

## 📝 Чек-лист деплоя

### Фронтенд (Vercel)
- [ ] Код загружен в GitHub
- [ ] Vercel подключен к репозиторию
- [ ] Переменная `REACT_APP_API_URL` настроена
- [ ] Сборка проходит успешно
- [ ] Сайт доступен по URL

### Бэкенд (PythonAnywhere)
- [ ] Код загружен на сервер
- [ ] Виртуальное окружение создано
- [ ] Зависимости установлены
- [ ] Миграции выполнены
- [ ] WSGI файл настроен
- [ ] Статические файлы настроены
- [ ] CORS настроен для фронтенда
- [ ] Сайт доступен по URL

## 🐛 Решение проблем

### CORS ошибки
Убедитесь, что в `CORS_ALLOWED_ORIGINS` указан правильный URL фронтенда.

### 500 ошибки
Проверьте логи в панели PythonAnywhere и убедитесь, что все зависимости установлены.

### Статические файлы не загружаются
Проверьте настройки статических файлов в панели PythonAnywhere.

## 🔗 Полезные ссылки
- [Vercel Documentation](https://vercel.com/docs)
- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [Django Deployment](https://docs.djangoproject.com/en/stable/howto/deployment/)
