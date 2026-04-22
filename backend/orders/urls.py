from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.StoreSettingView.as_view(), name='store-settings'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/status/', views.UpdateOrderStatusView.as_view(), name='order-status'),
]
