import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiClock, HiEye, HiShoppingBag } from 'react-icons/hi';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getOrders();
        setOrders(res.data?.results || res.data || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className="page-container animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800 mb-6 sm:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <span className="text-5xl sm:text-7xl block mb-4">📦</span>
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-dark-700 mb-2">No orders yet</h2>
          <p className="text-dark-500 mb-6 text-sm sm:text-base">Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary text-sm sm:text-base">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-4 sm:p-5 hover:border-primary-200 border border-transparent transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                    <span className="font-display font-bold text-dark-800 text-sm sm:text-base">{order.order_number}</span>
                    <span className={`${statusColors[order.status] || 'badge'} text-[10px] sm:text-xs`}>
                      {order.status_display}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-sm text-dark-500">
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>{order.items_count} items</span>
                    <span className="font-semibold text-dark-700">₹{parseFloat(order.final_amount).toFixed(0)}</span>
                  </div>
                </div>
                <Link to={`/orders/${order.id}`} className="btn-outline text-xs sm:text-sm !py-2 !px-4 flex items-center gap-1 self-start sm:self-center">
                  <HiEye className="w-4 h-4" /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
