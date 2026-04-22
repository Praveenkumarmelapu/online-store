import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category

def populate():
    products_data = [
        {
            'name': 'Spicy Mixture',
            'description': 'A crunchy, spicy, and tangy mixture of sev, peanuts, and spices. Perfect with evening tea!',
            'price': 150.00,
            'discount_price': 130.00,
            'category_id': 1,
            'image_url': '/images/products/spicy_mixture.png',
            'stock': 50,
            'weight': '500g',
            'is_featured': True
        },
        {
            'name': 'Premium Cashews',
            'description': 'High-quality, roasted and lightly salted premium cashews packed with nutrients.',
            'price': 650.00,
            'discount_price': 599.00,
            'category_id': 2,
            'image_url': '/images/products/premium_cashews.png',
            'stock': 30,
            'weight': '500g',
            'is_featured': True
        },
        {
            'name': 'Besan Ladoo',
            'description': 'Traditional Indian sweets made with roasted gram flour, ghee, and sugar, infused with cardamom.',
            'price': 300.00,
            'discount_price': None,
            'category_id': 3,
            'image_url': '/images/products/besan_ladoo.png',
            'stock': 20,
            'weight': '12 Pieces',
            'is_featured': True
        },
        {
            'name': 'Crispy Murukku',
            'description': 'Authentic South Indian crunchy snack made from rice flour and urad dal.',
            'price': 120.00,
            'discount_price': 110.00,
            'category_id': 1,
            'image_url': '/images/products/crispy_murukku.png',
            'stock': 45,
            'weight': '250g',
            'is_featured': False
        }
    ]

    for data in products_data:
        cat_id = data.pop('category_id')
        try:
            category = Category.objects.get(id=cat_id)
            Product.objects.update_or_create(
                name=data['name'],
                defaults={
                    **data,
                    'category': category
                }
            )
            print(f"Added/Updated: {data['name']}")
        except Category.DoesNotExist:
            print(f"Category ID {cat_id} not found for {data['name']}")

if __name__ == '__main__':
    populate()
