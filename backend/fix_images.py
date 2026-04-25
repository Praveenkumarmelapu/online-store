import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category

# Online image mapping for categories
IMAGE_MAPPING = {
    'Namkeen & Mixtures': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    'Dry Fruits & Nuts': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
    'Sweets': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800',
    'Chips & Crisps': 'https://images.unsplash.com/photo-1623938988242-26330058955b?auto=format&fit=crop&q=80&w=800',
    'Pickles & Chutneys': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800',
    'Cookies & Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
}

def fix_all_images():
    print("Starting universal image update...")
    products = Product.objects.all()
    count = 0
    
    for p in products:
        # If product has no uploaded image and no image_url, or if image_url is a local path
        if (not p.image and not p.image_url) or (p.image_url and p.image_url.startswith('/')):
            cat_name = p.category.name if p.category else 'Default'
            online_url = IMAGE_MAPPING.get(cat_name, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800')
            
            p.image_url = online_url
            p.save()
            print(f"  Updated: {p.name} -> {cat_name}")
            count += 1
            
    print(f"Finished! Updated {count} products with online URLs.")

if __name__ == "__main__":
    fix_all_images()
