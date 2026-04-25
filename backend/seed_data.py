"""
Seed script: Populate the database with sample data.
Run: python manage.py shell < seed_data.py
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Category, Product
from coupons.models import Coupon
from datetime import date, timedelta

User = get_user_model()

print("Seeding database...")

# Create admin user
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@snackstore.com',
        'is_staff': True,
        'is_superuser': True,
        'first_name': 'Admin',
        'last_name': 'User',
        'is_customer': False,
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("  Created admin user: admin@snackstore.com / admin123")

# Create test customer
customer, created = User.objects.get_or_create(
    username='customer',
    defaults={
        'email': 'customer@example.com',
        'first_name': 'Test',
        'last_name': 'Customer',
        'phone': '9876543210',
        'address': '123 Main Street',
        'city': 'Mumbai',
        'state': 'Maharashtra',
        'pincode': '400001',
    }
)
if created:
    customer.set_password('customer123')
    customer.save()
    print("  Created test customer: customer@example.com / customer123")

# Create categories
categories_data = [
    {'name': 'Namkeen & Mixtures', 'description': 'Crunchy and savory homemade namkeen and mixture snacks'},
    {'name': 'Dry Fruits & Nuts', 'description': 'Premium quality dry fruits and roasted nuts'},
    {'name': 'Sweets', 'description': 'Traditional homemade Indian sweets'},
    {'name': 'Chips & Crisps', 'description': 'Crispy homemade chips and wafers'},
    {'name': 'Pickles & Chutneys', 'description': 'Authentic homemade pickles and chutneys'},
    {'name': 'Cookies & Biscuits', 'description': 'Freshly baked cookies and biscuits'},
]

categories = {}
for data in categories_data:
    cat, created = Category.objects.get_or_create(name=data['name'], defaults=data)
    categories[data['name']] = cat
    if created:
        print("  Created category: {}".format(data['name']))

# Create products
products_data = [
    # Namkeen & Mixtures
    {'name': 'Classic Namkeen Mix', 'category': 'Namkeen & Mixtures', 'price': 199, 'discount_price': 179,
     'description': 'A perfect blend of sev, peanuts, raisins, and crispy lentils. Freshly made with premium ingredients and traditional spices.', 'stock': 50, 'is_featured': True, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Cornflakes Mixture', 'category': 'Namkeen & Mixtures', 'price': 249, 'discount_price': 219,
     'description': 'Crunchy cornflakes mixed with roasted peanuts, curry leaves, and aromatic spices.', 'stock': 40, 'is_featured': True, 'weight': '300g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Aloo Bhujia', 'category': 'Namkeen & Mixtures', 'price': 149, 'discount_price': None,
     'description': 'Thin and crispy potato noodles seasoned with a blend of traditional spices.', 'stock': 60, 'weight': '200g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Moong Dal Namkeen', 'category': 'Namkeen & Mixtures', 'price': 179, 'discount_price': 159,
     'description': 'Crispy fried moong dal seasoned with salt, pepper, and a hint of asafoetida.', 'stock': 35, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},

    # Dry Fruits & Nuts
    {'name': 'Premium Cashews', 'category': 'Dry Fruits & Nuts', 'price': 599, 'discount_price': 549,
     'description': 'Whole premium grade cashew nuts, roasted with a pinch of Himalayan pink salt.', 'stock': 30, 'is_featured': True, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Roasted Almonds', 'category': 'Dry Fruits & Nuts', 'price': 649, 'discount_price': None,
     'description': 'California almonds lightly roasted to perfection. Rich in protein and healthy fats.', 'stock': 25, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Mixed Dry Fruits Pack', 'category': 'Dry Fruits & Nuts', 'price': 899, 'discount_price': 799,
     'description': 'A wholesome mix of almonds, cashews, raisins, and pistachios.', 'stock': 20, 'is_featured': True, 'weight': '500g', 'image_url': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Salted Pistachios', 'category': 'Dry Fruits & Nuts', 'price': 749, 'discount_price': None,
     'description': 'Iranian pistachios lightly salted and roasted. Perfect for snacking.', 'stock': 15, 'weight': '200g', 'image_url': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'},

    # Sweets
    {'name': 'Besan Ladoo', 'category': 'Sweets', 'price': 349, 'discount_price': 299,
     'description': 'Melt-in-mouth besan ladoos made with pure ghee, sugar, and cardamom.', 'stock': 40, 'is_featured': True, 'weight': '500g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Coconut Barfi', 'category': 'Sweets', 'price': 299, 'discount_price': None,
     'description': 'Rich and creamy coconut barfi made with fresh desiccated coconut and condensed milk.', 'stock': 30, 'weight': '400g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Kaju Katli', 'category': 'Sweets', 'price': 499, 'discount_price': 449,
     'description': 'Thin, diamond-shaped cashew fudge. A premium delicacy for festive occasions.', 'stock': 25, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},

    # Chips & Crisps
    {'name': 'Banana Chips', 'category': 'Chips & Crisps', 'price': 149, 'discount_price': 129,
     'description': 'Crispy banana chips made from raw Kerala bananas, fried in coconut oil.', 'stock': 60, 'is_featured': True, 'weight': '200g', 'image_url': 'https://images.unsplash.com/photo-1623938988242-26330058955b?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Tapioca Chips', 'category': 'Chips & Crisps', 'price': 129, 'discount_price': None,
     'description': 'Thin and crunchy tapioca chips with a light seasoning of salt and spices.', 'stock': 45, 'weight': '200g', 'image_url': 'https://images.unsplash.com/photo-1623938988242-26330058955b?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Sweet Potato Chips', 'category': 'Chips & Crisps', 'price': 179, 'discount_price': 159,
     'description': 'Naturally sweet, crispy chips made from fresh sweet potatoes.', 'stock': 35, 'weight': '150g', 'image_url': 'https://images.unsplash.com/photo-1623938988242-26330058955b?auto=format&fit=crop&q=80&w=800'},

    # Pickles & Chutneys
    {'name': 'Mango Pickle', 'category': 'Pickles & Chutneys', 'price': 199, 'discount_price': None,
     'description': 'Traditional raw mango pickle made with mustard oil and aromatic spices.', 'stock': 40, 'weight': '300g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Mixed Vegetable Pickle', 'category': 'Pickles & Chutneys', 'price': 229, 'discount_price': 199,
     'description': 'A tangy mix of carrot, cauliflower, lemon, and green chilli pickle.', 'stock': 30, 'weight': '300g', 'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'},

    # Cookies & Biscuits
    {'name': 'Butter Cookies', 'category': 'Cookies & Biscuits', 'price': 249, 'discount_price': 219,
     'description': 'Rich and buttery cookies baked to golden perfection. Made with premium butter.', 'stock': 50, 'is_featured': True, 'weight': '300g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Whole Wheat Biscuits', 'category': 'Cookies & Biscuits', 'price': 179, 'discount_price': None,
     'description': 'Healthy whole wheat biscuits with a hint of jaggery sweetness.', 'stock': 45, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},
    {'name': 'Chocolate Chip Cookies', 'category': 'Cookies & Biscuits', 'price': 299, 'discount_price': 269,
     'description': 'Loaded with premium chocolate chips. Soft, chewy, and utterly delicious.', 'stock': 35, 'weight': '250g', 'image_url': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800'},
]

for data in products_data:
    cat_name = data.pop('category')
    data['category'] = categories[cat_name]
    product, created = Product.objects.update_or_create(name=data['name'], defaults=data)
    if created:
        print("  Created product: {}".format(data['name']))
    else:
        print("  Updated product: {}".format(data['name']))

# Create coupons
coupons_data = [
    {'code': 'WELCOME10', 'discount_percent': 10, 'min_order_amount': 299, 'max_discount': 100,
     'expiry_date': date.today() + timedelta(days=90), 'usage_limit': 100},
    {'code': 'SNACK20', 'discount_percent': 20, 'min_order_amount': 499, 'max_discount': 200,
     'expiry_date': date.today() + timedelta(days=60), 'usage_limit': 50},
    {'code': 'FESTIVE15', 'discount_percent': 15, 'min_order_amount': 399, 'max_discount': 150,
     'expiry_date': date.today() + timedelta(days=30), 'usage_limit': 200},
]

for data in coupons_data:
    coupon, created = Coupon.objects.get_or_create(code=data['code'], defaults=data)
    if created:
        print("  Created coupon: {}".format(data['code']))

print("\nSeeding complete!")
print("Admin login: admin@snackstore.com / admin123")
print("Customer login: customer@example.com / customer123")
