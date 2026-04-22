from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('', views.ProductListCreateView.as_view(), name='product-list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='product-featured'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]
