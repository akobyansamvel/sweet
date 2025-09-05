"""
WSGI config for bakery_calculator project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bakery_calculator.settings')

application = get_wsgi_application()
