from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from datetime import timedelta, datetime
from orders.models import Order
from django.contrib.auth import get_user_model

User = get_user_model()


class DashboardView(APIView):
    """Admin: Get dashboard KPI data."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)

        # Total stats
        total_orders = Order.objects.exclude(status='cancelled').count()
        total_revenue = Order.objects.exclude(status='cancelled').aggregate(
            total=Sum('final_amount')
        )['total'] or 0

        # Today's stats
        today_orders = Order.objects.filter(
            created_at__date=today
        ).exclude(status='cancelled').count()
        today_revenue = Order.objects.filter(
            created_at__date=today
        ).exclude(status='cancelled').aggregate(
            total=Sum('final_amount')
        )['total'] or 0

        # Monthly stats
        monthly_orders = Order.objects.filter(
            created_at__date__gte=month_start
        ).exclude(status='cancelled').count()
        monthly_revenue = Order.objects.filter(
            created_at__date__gte=month_start
        ).exclude(status='cancelled').aggregate(
            total=Sum('final_amount')
        )['total'] or 0

        # Users count
        total_users = User.objects.filter(is_staff=False).count()

        # Pending orders
        pending_orders = Order.objects.filter(status='pending').count()

        # Recent orders
        from orders.serializers import OrderListSerializer
        recent_orders = Order.objects.all().select_related('user')[:5]
        recent_orders_data = OrderListSerializer(recent_orders, many=True).data

        # Check for new orders since last check
        last_check = request.query_params.get('last_check')
        new_orders_count = 0
        if last_check:
            try:
                # Expecting last_check in ISO format or timestamp
                last_check_dt = timezone.make_aware(datetime.fromisoformat(last_check.replace('Z', '+00:00')))
                new_orders_count = Order.objects.filter(created_at__gt=last_check_dt).count()
            except (ValueError, TypeError):
                pass

        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'today_orders': today_orders,
            'today_revenue': float(today_revenue),
            'monthly_orders': monthly_orders,
            'monthly_revenue': float(monthly_revenue),
            'total_users': total_users,
            'pending_orders': pending_orders,
            'recent_orders': recent_orders_data,
            'new_orders_count': new_orders_count,
            'server_time': timezone.now().isoformat(),
        })


class SalesChartView(APIView):
    """Admin: Get sales data for charts."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        period = request.query_params.get('period', 'daily')
        today = timezone.now().date()

        if period == 'daily':
            # Last 30 days
            start_date = today - timedelta(days=30)
            data = (
                Order.objects
                .filter(created_at__date__gte=start_date)
                .exclude(status='cancelled')
                .annotate(date=TruncDate('created_at'))
                .values('date')
                .annotate(
                    orders=Count('id'),
                    revenue=Sum('final_amount'),
                )
                .order_by('date')
            )
            chart_data = [
                {
                    'date': item['date'].strftime('%Y-%m-%d'),
                    'orders': item['orders'],
                    'revenue': float(item['revenue'] or 0),
                }
                for item in data
            ]
        else:
            # Last 12 months
            start_date = today.replace(day=1) - timedelta(days=365)
            data = (
                Order.objects
                .filter(created_at__date__gte=start_date)
                .exclude(status='cancelled')
                .annotate(month=TruncMonth('created_at'))
                .values('month')
                .annotate(
                    orders=Count('id'),
                    revenue=Sum('final_amount'),
                )
                .order_by('month')
            )
            chart_data = [
                {
                    'date': item['month'].strftime('%Y-%m'),
                    'orders': item['orders'],
                    'revenue': float(item['revenue'] or 0),
                }
                for item in data
            ]

        return Response(chart_data)
