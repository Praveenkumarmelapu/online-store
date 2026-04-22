import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiUser, HiCheckCircle, HiTag } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI, couponsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const couponCode = location.state?.couponCode || '';

  const [formData, setFormData] = useState({
    full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [storeSettings, setStoreSettings] = useState({ delivery_charge: 0, free_delivery_threshold: 0 });

  // Fetch available coupons on mount
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const res = await couponsAPI.getAvailableCoupons();
        setAvailableCoupons(res.data || []);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoadingCoupons(false);
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await import('../services/api').then(m => m.settingsAPI.getSettings());
        setStoreSettings(res.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchAvailableCoupons();
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const data = { ...formData };
      if (couponCode) data.coupon_code = couponCode;
      const res = await ordersAPI.checkout(data);
      setOrderPlaced(res.data);
      toast.success('Order placed successfully!');
      await import('../services/api').then(m => m.cartAPI.clearCart());

    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Coupon ${code} copied! Apply it in your cart.`);
    }).catch(() => {
      toast.success(`Use coupon: ${code}`);
    });
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="page-container animate-fade-in">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="font-display font-bold text-3xl text-dark-800 mb-3">Order Placed!</h1>
          <p className="text-dark-500 mb-2">Thank you for your order. Your delicious snacks are on the way!</p>
          <p className="text-sm text-dark-400 mb-8">
            Order Number: <span className="font-bold text-primary-600">{orderPlaced.order_number}</span>
          </p>
          <div className="card p-6 text-left mb-8">
            <h3 className="font-semibold text-dark-800 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {orderPlaced.items?.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-dark-600">{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.subtotal}</span>
                </div>
              ))}
              <hr className="border-dark-100 my-2" />
              {orderPlaced.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{parseFloat(orderPlaced.discount_amount).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-bold text-dark-800 text-base">
                <span>Total</span>
                <span>₹{parseFloat(orderPlaced.final_amount).toFixed(0)}</span>
              </div>
              <p className="text-xs text-dark-400 mt-2">Payment: Cash on Delivery</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(`/orders/${orderPlaced.id}`)} className="btn-primary">
              Track Order
            </button>
            <button onClick={() => navigate('/products')} className="btn-outline">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800 mb-6 sm:mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="card p-4 sm:p-6">
              <h2 className="font-display font-semibold text-lg sm:text-xl text-dark-800 mb-5 sm:mb-6 flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                      className="input-field !pl-10 !py-2.5" required id="checkout-name" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
                  <div className="relative">
                    <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="input-field !pl-10 !py-2.5" required id="checkout-phone" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange}
                    className="input-field !py-2.5" rows="2" required id="checkout-address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange}
                    className="input-field !py-2.5" required id="checkout-city" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                      className="input-field !py-2.5" required id="checkout-state" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                      className="input-field !py-2.5" required id="checkout-pincode" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-700 mb-1">Order Notes (Optional)</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleChange}
                    className="input-field !py-2.5" placeholder="Any special instructions" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 sm:mt-8">
                <h3 className="font-display font-semibold text-base sm:text-lg text-dark-800 mb-3">Payment Method</h3>
                <div className="p-3 sm:p-4 border-2 border-primary-500 bg-primary-50 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm sm:text-base text-dark-800">💵 Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>

            {/* Available Coupons Section */}
            {availableCoupons.length > 0 && (
              <div className="card p-4 sm:p-6 mt-5 sm:mt-6">
                <h2 className="font-display font-semibold text-lg sm:text-xl text-dark-800 mb-4 flex items-center gap-2">
                  <HiTag className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" /> Available Coupons
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  {availableCoupons.map((coupon) => (
                    <div key={coupon.id}
                      className="relative p-3 sm:p-4 rounded-xl border-2 border-dashed border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:border-primary-400 transition-all group cursor-pointer"
                      onClick={() => handleCopyCoupon(coupon.code)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block bg-primary-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full mb-1.5 sm:mb-2">
                            {parseFloat(coupon.discount_percent).toFixed(0)}% OFF
                          </span>
                          <p className="font-display font-bold text-base sm:text-lg text-dark-800 tracking-wider">
                            {coupon.code}
                          </p>
                        </div>
                        <span className="text-[10px] text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Copy
                        </span>
                      </div>
                      <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-dark-500">
                        {parseFloat(coupon.min_order_amount) > 0 && (
                          <p>Min order: ₹{parseFloat(coupon.min_order_amount).toFixed(0)}</p>
                        )}
                        <p>Valid till: {new Date(coupon.expiry_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-display font-semibold text-lg sm:text-xl text-dark-800 mb-4">Order Summary</h2>
              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                {cart.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-dark-600 line-clamp-1 flex-1 mr-2">
                      {item.product_detail?.name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <hr className="border-dark-100 mb-4" />
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span>₹{parseFloat(cart.total_price || 0).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Delivery</span>
                  {parseFloat(cart.total_price || 0) >= parseFloat(storeSettings.free_delivery_threshold) ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>₹{parseFloat(storeSettings.delivery_charge).toFixed(0)}</span>
                  )}
                </div>
                {couponCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponCode})</span>
                    <span>Applied ✓</span>
                  </div>
                )}
                <hr className="border-dark-100" />
                <div className="flex justify-between font-display font-bold text-lg text-dark-800">
                  <span>Total</span>
                  <span>₹{(
                    parseFloat(cart.total_price || 0) + 
                    (parseFloat(cart.total_price || 0) >= parseFloat(storeSettings.free_delivery_threshold) ? 0 : parseFloat(storeSettings.delivery_charge))
                  ).toFixed(0)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full mt-6 !py-3 text-base animate-pulse-glow"
                id="place-order-btn">
                {loading ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
