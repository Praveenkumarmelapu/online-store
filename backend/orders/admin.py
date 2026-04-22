from django.contrib import admin
from .models import Order, OrderItem, StoreSetting


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'final_amount', 'status', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__email', 'full_name']
    list_editable = ['status']
    inlines = [OrderItemInline]
    readonly_fields = ['order_number', 'created_at', 'updated_at']


@admin.register(StoreSetting)
class StoreSettingAdmin(admin.ModelAdmin):
    list_display = ['delivery_charge', 'free_delivery_threshold']

    def has_add_permission(self, request):
        # Only allow one instance
        return not StoreSetting.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
