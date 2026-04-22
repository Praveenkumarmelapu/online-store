from django.urls import path
from . import views

urlpatterns = [
    path('', views.CouponListCreateView.as_view(), name='coupon-list'),
    path('available/', views.AvailableCouponsView.as_view(), name='coupon-available'),
    path('<int:pk>/', views.CouponDetailView.as_view(), name='coupon-detail'),
    path('validate/', views.ValidateCouponView.as_view(), name='coupon-validate'),
]
