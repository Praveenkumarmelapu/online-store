#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
mkdir -p media/products
python manage.py shell < seed_data.py
python fix_images.py
