import { useState, useEffect } from 'react';
import { HiEye, HiX, HiPhone, HiLocationMarker, HiClock, HiCurrencyRupee, HiPrinter, HiTrash } from 'react-icons/hi';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getOrders();
      setOrders(res.data?.results || res.data || []);
    } catch (error) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const fetchOrderDetail = async (id) => {
    try {
      const res = await ordersAPI.getOrder(id);
      setSelectedOrder(res.data);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (error) { toast.error('Failed to update status'); }
  };
  
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      await ordersAPI.deleteOrder(id);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800 mb-6">Orders</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 text-dark-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order #</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-dark-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-dark-800">{order.order_number}</td>
                  <td className="px-4 py-3 text-dark-600 hidden md:table-cell truncate max-w-[150px]">{order.user_email}</td>
                  <td className="px-4 py-3 font-medium">₹{parseFloat(order.final_amount).toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="text-[10px] sm:text-xs border border-dark-200 rounded-lg px-1.5 sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-dark-500 hidden sm:table-cell">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => fetchOrderDetail(order.id)} className="p-1.5 text-dark-400 hover:text-primary-500 transition-colors" title="View Details">
                      <HiEye className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 text-dark-400 hover:text-red-500 transition-colors" title="Delete Order">
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-dark-400">No orders yet.</div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatusUpdate }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 print:p-0 print:bg-white print:block">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in print:shadow-none print:max-w-none print:h-auto print:overflow-visible print:animate-none">
        <div className="sticky top-0 bg-white border-b border-dark-100 px-6 py-4 flex items-center justify-between z-10 print:hidden">
          <h2 className="font-display font-bold text-xl text-dark-800">Order #{order.order_number}</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-50 rounded-full transition-colors">
            <HiX className="w-6 h-6 text-dark-400" />
          </button>
        </div>

        <div className="p-6 space-y-8 print:p-8 print:space-y-6">
          {/* Print-only Header */}
          <div className="hidden print:flex justify-between items-start border-b-2 border-dark-800 pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-dark-900">SnackStore</h1>
              <p className="text-sm text-dark-500 mt-1">Order Shipping Label</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">#{order.order_number}</p>
              <p className="text-xs text-dark-500">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Status & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-dark-800 flex items-center gap-2">
                <HiClock className="w-5 h-5 text-primary-500 print:hidden" /> Status & Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Order Status:</span>
                  <span className="font-bold print:text-dark-800 hidden print:inline">{order.status.toUpperCase()}</span>
                  <select 
                    value={order.status} 
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                    className={`text-xs font-bold rounded-lg px-3 py-1 border-2 ${statusColors[order.status]} bg-white outline-none focus:ring-2 focus:ring-primary-400 print:hidden`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Ordered On:</span>
                  <span className="font-medium text-dark-800">
                    {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Payment:</span>
                  <span className="font-medium text-dark-800 uppercase">{order.payment_method}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-semibold text-dark-800 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 text-primary-500 print:hidden" /> Delivery Address
              </h3>
              <div className="bg-dark-50 p-4 rounded-xl border border-dark-100 print:bg-white print:border-2 print:border-dark-800">
                <p className="font-bold text-dark-800 text-base">{order.full_name}</p>
                <p className="text-dark-600 text-sm mt-1 leading-relaxed print:text-dark-900 print:font-medium">
                  {order.address}<br />
                  {order.city}, {order.state} - {order.pincode}
                </p>
                <div className="flex items-center gap-2 mt-3 text-primary-600 print:text-dark-900">
                  <HiPhone className="w-4 h-4" />
                  <span className="text-sm font-bold">{order.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-dark-800 flex items-center gap-2">
              <HiCurrencyRupee className="w-5 h-5 text-primary-500" /> Order Items
            </h3>
            <div className="border border-dark-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-dark-500">Item</th>
                    <th className="text-center px-4 py-2 font-medium text-dark-500">Qty</th>
                    <th className="text-right px-4 py-2 font-medium text-dark-500">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {order.items?.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-dark-800">{item.product_name}</td>
                      <td className="px-4 py-3 text-center text-dark-600">x{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-dark-800">₹{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-dark-50/50">
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-right text-dark-500">Subtotal:</td>
                    <td className="px-4 py-2 text-right font-medium">₹{order.total_amount}</td>
                  </tr>
                  {parseFloat(order.discount_amount) > 0 && (
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-right text-green-600">Discount:</td>
                      <td className="px-4 py-2 text-right font-medium text-green-600">-₹{order.discount_amount}</td>
                    </tr>
                  )}
                  {parseFloat(order.delivery_charge) > 0 && (
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-right text-dark-500">Delivery:</td>
                      <td className="px-4 py-2 text-right font-medium">₹{order.delivery_charge}</td>
                    </tr>
                  )}
                  <tr className="border-t border-dark-200">
                    <td colSpan="2" className="px-4 py-3 text-right font-display font-bold text-dark-800 text-lg">Total Amount:</td>
                    <td className="px-4 py-3 text-right font-display font-bold text-primary-600 text-lg">₹{parseFloat(order.final_amount).toFixed(0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="text-xs font-bold text-amber-700 uppercase mb-1">Customer Notes:</h4>
              <p className="text-sm text-amber-800">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-dark-50 flex flex-wrap justify-end gap-3 print:hidden">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-dark-200 rounded-xl font-semibold text-dark-600 hover:bg-white/50 transition-colors">
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-dark-800 text-white rounded-xl font-semibold hover:bg-dark-900 transition-colors flex items-center gap-2"
          >
            <HiPrinter className="w-5 h-5" /> Print Label
          </button>
          <button 
            onClick={() => {
              const itemsList = order.items.map(item => `- ${item.product_name} x ${item.quantity}`).join('%0A');
              const message = `*Order Confirmation - SnackStore*%0A%0AHello ${order.full_name}, thank you for your order!%0A%0A*Order details:*%0AOrder Number: ${order.order_number}%0AItems:%0A${itemsList}%0A%0A*Total Amount: ₹${parseFloat(order.final_amount).toFixed(0)}*%0APayment: ${order.payment_method.toUpperCase()}%0A%0AWe are processing your order and will notify you once it is shipped!`;
              const whatsappUrl = `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${message}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="px-6 py-2 bg-[#25D366] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
