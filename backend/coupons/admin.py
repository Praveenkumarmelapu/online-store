from django.contrib import admin
from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percent', 'min_order_amount', 'max_discount',
                    'is_active', 'expiry_date', 'usage_limit', 'used_count']
    list_filter = ['is_active', 'expiry_date']
    search_fields = ['code']
    list_editable = ['is_active']
