from rest_framework import serializers
from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_percent', 'min_order_amount',
                  'max_discount', 'is_active', 'expiry_date', 'usage_limit',
                  'used_count', 'is_valid', 'created_at']


class AvailableCouponSerializer(serializers.ModelSerializer):
    """Customer-facing serializer showing only relevant coupon info."""
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_percent', 'min_order_amount',
                  'max_discount', 'expiry_date']


class ValidateCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    order_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
