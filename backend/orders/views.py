from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Order, OrderItem, StoreSetting
from .serializers import (
    OrderSerializer, OrderListSerializer,
    CheckoutSerializer, UpdateOrderStatusSerializer,
    StoreSettingSerializer,
)
from cart.models import Cart
from coupons.models import Coupon


class CheckoutView(APIView):
    """Place an order from the user's cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Get user's cart
        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total
        total_amount = sum(item.subtotal for item in cart_items)
        discount_amount = 0
        coupon = None

        # Apply coupon if provided
        coupon_code = data.get('coupon_code', '').strip()
        if coupon_code:
            try:
                coupon = Coupon.objects.get(
                    code__iexact=coupon_code,
                    is_active=True,
                    expiry_date__gte=timezone.now().date()
                )
                if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
                    return Response({'error': 'Coupon usage limit reached.'}, status=status.HTTP_400_BAD_REQUEST)
                if total_amount < coupon.min_order_amount:
                    return Response(
                        {'error': 'Minimum order amount for this coupon is {}'.format(coupon.min_order_amount)},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                discount_amount = total_amount * coupon.discount_percent / 100
                if coupon.max_discount and discount_amount > coupon.max_discount:
                    discount_amount = coupon.max_discount
            except Coupon.DoesNotExist:
                return Response({'error': 'Invalid coupon code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch Store Settings
        settings = StoreSetting.load()
        delivery_charge = settings.delivery_charge if total_amount < settings.free_delivery_threshold else 0
        
        final_amount = total_amount - discount_amount + delivery_charge

        # Check stock
        for item in cart_items:
            if item.product.stock < item.quantity:
                return Response(
                    {'error': '{} has only {} items in stock.'.format(item.product.name, item.product.stock)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Create order
        order = Order.objects.create(
            user=request.user,
            full_name=data['full_name'],
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            pincode=data['pincode'],
            total_amount=total_amount,
            discount_amount=discount_amount,
            delivery_charge=delivery_charge,
            final_amount=final_amount,
            coupon=coupon,
            payment_method='cod',
            notes=data.get('notes', ''),
        )

        # Create order items and update stock
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_price=item.product.effective_price,
                quantity=item.quantity,
            )
            item.product.stock -= item.quantity
            item.product.save()

        # Update coupon usage
        if coupon:
            coupon.used_count += 1
            coupon.save()

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """List orders — users see their own, admins see all."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return OrderListSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().select_related('user')
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """Get order details."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().select_related('user')
        return Order.objects.filter(user=self.request.user)


class UpdateOrderStatusView(APIView):
    """Admin: Update order status."""
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        order.status = serializer.validated_data['status']
        order.save()
        return Response(OrderSerializer(order).data)

    def patch(self, request, pk):
        return self.put(request, pk)


class StoreSettingView(APIView):
    """View/Update Store Settings (Delivery charges, etc.)."""
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
        
    def get(self, request):
        settings = StoreSetting.load()
        serializer = StoreSettingSerializer(settings)
        return Response(serializer.data)
        
    def patch(self, request):
        settings = StoreSetting.load()
        serializer = StoreSettingSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
