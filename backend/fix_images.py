import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category

# Online image mapping for categories (Verified high-quality URLs)
IMAGE_MAPPING = {
    'Namkeen & Mixtures': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    'Dry Fruits & Nuts': 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800',
    'Sweets': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    'Chips & Crisps': 'https://images.unsplash.com/photo-1621447509323-5705627d45ee?auto=format&fit=crop&q=80&w=800',
    'Pickles & Chutneys': 'https://images.unsplash.com/photo-1599143338408-f740c05a3094?auto=format&fit=crop&q=80&w=800',
    'Cookies & Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
}

def fix_all_images():
    print("Starting universal image update...")
    products = Product.objects.all()
    count = 0
    
    for p in products:
        # ALWAYS update if it's currently a broken Unsplash URL or a local path
        # or if we want to ensure category-correct images
        cat_name = p.category.name if p.category else 'Default'
        target_url = IMAGE_MAPPING.get(cat_name, IMAGE_MAPPING['Namkeen & Mixtures'])
        
        if p.image_url != target_url:
            p.image_url = target_url
            p.save()
            print(f"  Updated: {p.name} -> {cat_name}")
            count += 1
            
    print(f"Finished! Updated {count} products with online URLs.")

if __name__ == "__main__":
    fix_all_images()
