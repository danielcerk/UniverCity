#!/bin/bash

# Ativar o ambiente virtual
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar as migrações
python manage.py migrate --noinput

