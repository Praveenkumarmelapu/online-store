import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product

cnt = 0
for p in Product.objects.all():
    if not p.image and not p.image_url:
        cat_id = p.category_id
        if cat_id == 1:
            p.image_url = '/images/products/spicy_mixture.png'
        elif cat_id == 2:
            p.image_url = '/images/products/premium_cashews.png'
        elif cat_id == 3:
            p.image_url = '/images/products/besan_ladoo.png'
        elif cat_id == 4:
            p.image_url = '/images/products/crispy_murukku.png'
        elif cat_id == 5:
            p.image_url = '/images/products/spicy_mixture.png'
        elif cat_id == 6:
            p.image_url = '/images/products/besan_ladoo.png'
        else:
            p.image_url = '/images/products/spicy_mixture.png'
        
        p.save()
        cnt += 1

print(f"Successfully updated {cnt} products with placeholder images.")
