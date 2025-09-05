"""
WSGI config for bakery_calculator project for PythonAnywhere deployment.
"""

import os
import sys

# Add the project directory to the Python path
path = '/home/your-username/backend'  # Change 'your-username' to your actual username
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bakery_calculator.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
