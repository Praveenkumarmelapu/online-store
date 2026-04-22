from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Product category (e.g., Snacks, Dry Fruits, Sweets)."""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product model for homemade snacks store."""
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text='External image URL')
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    weight = models.CharField(max_length=50, blank=True, default='', help_text='e.g., 250g, 500g, 1kg')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure unique slug
            counter = 1
            original_slug = self.slug
            while Product.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = '{}-{}'.format(original_slug, counter)
                counter += 1
        super().save(*args, **kwargs)

    @property
    def effective_price(self):
        """Return discount price if available, else regular price."""
        return self.discount_price if self.discount_price else self.price

    @property
    def display_image(self):
        """Prefer external image URL if available, otherwise use uploaded image."""
        if self.image_url:
            return self.image_url
        if self.image:
            return self.image.url
        return ''

    @property
    def discount_percent(self):
        """Calculate discount percentage."""
        if self.discount_price and self.discount_price < self.price and self.price > 0:
            return round(((float(self.price) - float(self.discount_price)) / float(self.price)) * 100)
        return 0

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return self.name
