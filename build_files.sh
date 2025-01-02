#!/bin/bash

# Instalar dependências

pip install gunicorn

pip install -r requirements.txt

# Rodar migrações
python manage.py makemigrations
python manage.py migrate --noinput
