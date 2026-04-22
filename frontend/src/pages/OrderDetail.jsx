import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiClock, HiLocationMarker, HiPhone, HiArrowLeft } from 'react-icons/hi';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.getOrder(id);
        setOrder(res.data);
      } catch (error) {
        console.error('Failed to load order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="page-container animate-fade-in">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-dark-500 hover:text-primary-500 mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Order {order.order_number}</h1>
          <p className="text-dark-500 text-xs sm:text-sm mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Order Status Timeline */}
      {!isCancelled ? (
        <div className="card p-4 sm:p-6 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-5 sm:mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative min-w-[300px]">
            <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-dark-200"></div>
            <div className="absolute top-4 sm:top-5 left-0 h-0.5 bg-primary-500 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}></div>
            {statusSteps.map((step, index) => (
              <div key={step} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm
                  ${index <= currentStepIndex ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-dark-200 text-dark-500'}`}>
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span className={`text-[10px] sm:text-xs mt-2 font-medium ${index <= currentStepIndex ? 'text-primary-600' : 'text-dark-400'}`}>
                  {statusLabels[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-4 mb-8 bg-red-50 border border-red-200">
          <p className="text-red-600 font-medium text-sm">❌ This order has been cancelled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card p-4 sm:p-6">
            <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-4">Order Items</h2>
            <div className="space-y-3 sm:space-y-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-dark-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-dark-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product_image ? (
                        <img 
                          src={item.product_image.startsWith('/media/') ? `http://127.0.0.1:8000${item.product_image}` : item.product_image} 
                          alt={item.product_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl">🍿</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-dark-800 text-sm sm:text-base truncate">{item.product_name}</p>
                      <p className="text-[10px] sm:text-sm text-dark-400">₹{parseFloat(item.product_price).toFixed(0)} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-dark-800 text-sm sm:text-base ml-2">₹{parseFloat(item.subtotal).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary + Shipping */}
        <div className="space-y-6">
          <div className="card p-4 sm:p-6">
            <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-4">Payment Summary</h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal</span>
                <span>₹{parseFloat(order.total_amount).toFixed(0)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{parseFloat(order.discount_amount).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-dark-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="border-dark-100" />
              <div className="flex justify-between font-display font-bold text-lg text-dark-800">
                <span>Total</span>
                <span>₹{parseFloat(order.final_amount).toFixed(0)}</span>
              </div>
              <p className="text-[10px] text-dark-400 mt-2">💵 Cash on Delivery</p>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <h2 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-4 flex items-center gap-2">
              <HiLocationMarker className="w-5 h-5 text-primary-500" /> Shipping Address
            </h2>
            <div className="text-xs sm:text-sm text-dark-600 space-y-1">
              <p className="font-medium text-dark-800">{order.full_name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} - {order.pincode}</p>
              <p className="flex items-center gap-1 mt-2 font-medium">
                <HiPhone className="w-4 h-4 text-primary-500" /> {order.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
