#!/usr/bin/env python
"""
Script to collect static files for production deployment.
Run this after deploying to PythonAnywhere.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bakery_calculator.settings')
    django.setup()
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
