from rest_framework import serializers
from .models import Order, OrderItem, StoreSetting
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'quantity', 'subtotal']

    def get_product_image(self, obj):
        if obj.product:
            return obj.product.display_image
        return None


class StoreSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSetting
        fields = ['delivery_charge', 'free_delivery_threshold']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'user_email', 'full_name', 'phone',
                  'address', 'city', 'state', 'pincode', 'total_amount',
                  'discount_amount', 'delivery_charge', 'final_amount', 'coupon', 'payment_method',
                  'status', 'status_display', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'user', 'created_at', 'updated_at']


class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight order serializer for list views."""
    items_count = serializers.SerializerMethodField()
    user_email = serializers.CharField(source='user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user_email', 'final_amount',
                  'status', 'status_display', 'items_count', 'payment_method',
                  'created_at']

    def get_items_count(self, obj):
        return obj.items.count()


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout / place order."""
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=15)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=10)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
