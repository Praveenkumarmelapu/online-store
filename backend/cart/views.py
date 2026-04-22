from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer


class CartView(APIView):
    """Get the current user's cart."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    """Add an item to the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, created = Cart.objects.get_or_create(user=request.user)
        product = Product.objects.get(pk=serializer.validated_data['product_id'])
        quantity = serializer.validated_data['quantity']

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={'quantity': quantity}
        )

        if not item_created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    """Update quantity of a cart item."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cart_item = CartItem.objects.get(
                pk=item_id, cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.quantity = serializer.validated_data['quantity']
        cart_item.save()

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    def patch(self, request, item_id):
        return self.put(request, item_id)


class RemoveCartItemView(APIView):
    """Remove an item from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(
                pk=item_id, cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)


class ClearCartView(APIView):
    """Clear all items from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
        except Cart.DoesNotExist:
            pass
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)
