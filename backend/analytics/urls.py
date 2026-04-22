from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='analytics-dashboard'),
    path('sales-chart/', views.SalesChartView.as_view(), name='analytics-sales-chart'),
]
