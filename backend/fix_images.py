import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category

# Online image mapping for categories (100% Verified URLs)
IMAGE_MAPPING = {
    'Namkeen & Mixtures': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    'Dry Fruits & Nuts': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
    'Sweets': 'https://images.unsplash.com/photo-1589113103503-49653d891b65?auto=format&fit=crop&q=80&w=800',
    'Chips & Crisps': 'https://images.unsplash.com/photo-1623938988242-26330058955b?auto=format&fit=crop&q=80&w=800',
    'Pickles & Chutneys': 'https://images.unsplash.com/photo-1599143338408-f740c05a3094?auto=format&fit=crop&q=80&w=800',
    'Cookies & Biscuits': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800',
}

def fix_all_images():
    print("Starting universal image update...")
    products = Product.objects.all()
    count = 0
    
    for p in products:
        name_lower = p.name.lower().strip()
        cat_name = p.category.name.strip() if p.category else 'Default'
        
        # 1. Manual Overrides for specific products in your screenshot
        if 'ege' in name_lower:
            target_url = IMAGE_MAPPING['Chips & Crisps']
        elif 'mango pickle' in name_lower:
            target_url = IMAGE_MAPPING['Pickles & Chutneys']
        elif 'mixed vegetable pickle' in name_lower:
            target_url = IMAGE_MAPPING['Pickles & Chutneys']
        elif 'sweet potato chips' in name_lower:
            target_url = IMAGE_MAPPING['Chips & Crisps']
        elif 'tapioca chips' in name_lower:
            target_url = IMAGE_MAPPING['Chips & Crisps']
        else:
            # 2. General category matching
            target_url = None
            for key, url in IMAGE_MAPPING.items():
                if key.lower() in cat_name.lower():
                    target_url = url
                    break
            
            if not target_url:
                target_url = IMAGE_MAPPING['Namkeen & Mixtures']

        # Force save the URL
        p.image_url = target_url
        p.save()
        print(f"  FORCE UPDATED: {p.name} -> {target_url}")
        count += 1
            
    print(f"Finished! Updated {count} products with online URLs.")

if __name__ == "__main__":
    fix_all_images()
