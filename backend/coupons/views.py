from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Coupon
from .serializers import CouponSerializer, ValidateCouponSerializer, AvailableCouponSerializer


class CouponListCreateView(generics.ListCreateAPIView):
    """Admin: List and create coupons."""
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]


class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: View/edit/delete a coupon."""
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]


class AvailableCouponsView(APIView):
    """Customer: List active, non-expired coupons."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        coupons = Coupon.objects.filter(
            is_active=True,
            expiry_date__gte=today,
        )
        # Exclude coupons that have reached their usage limit
        valid_coupons = [c for c in coupons if not (c.usage_limit and c.used_count >= c.usage_limit)]
        serializer = AvailableCouponSerializer(valid_coupons, many=True)
        return Response(serializer.data)


class ValidateCouponView(APIView):
    """Validate a coupon code and return discount info."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code']
        order_amount = serializer.validated_data.get('order_amount', 0)

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)

        if not coupon.is_active:
            return Response({'error': 'This coupon is no longer active.'}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.expiry_date < timezone.now().date():
            return Response({'error': 'This coupon has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            return Response({'error': 'Coupon usage limit reached.'}, status=status.HTTP_400_BAD_REQUEST)

        if order_amount and order_amount < coupon.min_order_amount:
            return Response(
                {'error': 'Minimum order amount is {}'.format(coupon.min_order_amount)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate discount
        discount = float(order_amount) * float(coupon.discount_percent) / 100 if order_amount else 0
        if coupon.max_discount and discount > float(coupon.max_discount):
            discount = float(coupon.max_discount)

        return Response({
            'valid': True,
            'code': coupon.code,
            'discount_percent': coupon.discount_percent,
            'discount_amount': round(discount, 2),
            'min_order_amount': coupon.min_order_amount,
            'max_discount': coupon.max_discount,
        })
