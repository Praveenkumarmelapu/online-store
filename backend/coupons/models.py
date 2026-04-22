from django.db import models


class Coupon(models.Model):
    """Discount coupon for orders."""
    code = models.CharField(max_length=50, unique=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, help_text='Discount percentage (e.g., 10.00 for 10%)')
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='Maximum discount amount cap')
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateField()
    usage_limit = models.PositiveIntegerField(null=True, blank=True, help_text='Max number of times this coupon can be used')
    used_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return '{} ({}% off)'.format(self.code, self.discount_percent)

    @property
    def is_valid(self):
        from django.utils import timezone
        if not self.is_active:
            return False
        if self.expiry_date < timezone.now().date():
            return False
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False
        return True
