#!/bin/bash

# Instalar dependências
pip install -r backend/requirements.txt

# Rodar migrações
python backend/manage.py makemigrations
python backend/manage.py migrate --noinput
