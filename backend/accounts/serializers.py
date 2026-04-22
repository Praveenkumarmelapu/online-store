from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer that uses email for login."""
    username_field = 'email'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'password2',
                  'first_name', 'last_name', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name',
                  'phone', 'address', 'city', 'state', 'pincode',
                  'is_staff', 'is_customer', 'created_at']
        read_only_fields = ['id', 'email', 'username', 'is_staff', 'created_at']


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for admin user list view."""
    orders_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name',
                  'phone', 'city', 'state', 'is_active', 'is_staff',
                  'created_at', 'orders_count']

    def get_orders_count(self, obj):
        return obj.orders.count() if hasattr(obj, 'orders') else 0
