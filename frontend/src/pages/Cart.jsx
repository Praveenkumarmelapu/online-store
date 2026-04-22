import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiTrash, HiMinus, HiPlus, HiArrowRight, HiTag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { couponsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../utils/image';

export default function Cart() {
  const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [storeSettings, setStoreSettings] = useState({ delivery_charge: 0, free_delivery_threshold: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponsAPI.getAvailableCoupons();
        setAvailableCoupons(res.data || []);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
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
    fetchCoupons();
    fetchSettings();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCouponData(null);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode || !couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await couponsAPI.validateCoupon(couponCode, cart.total_price);
      setCouponData(res.data);
      toast.success(`Coupon applied! ${res.data.discount_percent}% off`);
    } catch (error) {
      setCouponData(null);
      toast.error(error.response?.data?.error || 'Invalid coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode('');
  };

  if (loading) return <LoadingSpinner text="Loading cart..." />;

  const items = cart.items || [];
  const subtotal = parseFloat(cart.total_price || 0);
  const discount = couponData ? parseFloat(couponData.discount_amount || 0) : 0;
  
  const isFreeDelivery = subtotal >= parseFloat(storeSettings.free_delivery_threshold);
  const deliveryCharge = isFreeDelivery ? 0 : parseFloat(storeSettings.delivery_charge);
  const total = subtotal - discount + deliveryCharge;

  return (
    <div className="page-container animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800 mb-5 sm:mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <span className="text-5xl sm:text-7xl block mb-4">🛒</span>
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-dark-700 mb-2">Your cart is empty</h2>
          <p className="text-dark-500 mb-6 text-sm sm:text-base">Discover our delicious snacks and add them to your cart!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base">
            Browse Products <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => {
              const product = item.product_detail;
              const imageUrl = getProductImageUrl(product);

              return (
                <div key={item.id} className="card p-3 sm:p-4 flex gap-3 sm:gap-4 animate-slide-up">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary-50 rounded-xl overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">🍿</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product?.id}`} className="font-display font-semibold text-sm sm:text-base text-dark-800 hover:text-primary-500 transition-colors line-clamp-1">
                      {product?.name}
                    </Link>
                    <p className="text-xs sm:text-sm text-dark-400 mt-0.5">{product?.category_name}</p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <div className="flex items-center border border-dark-200 rounded-lg overflow-hidden">
                        <button onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 sm:p-1.5 hover:bg-dark-50 transition-colors touch-target">
                          <HiMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-2 sm:px-3 py-1 font-medium text-xs sm:text-sm">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 sm:p-1.5 hover:bg-dark-50 transition-colors touch-target">
                          <HiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="font-display font-bold text-sm sm:text-base text-dark-800">₹{item.subtotal}</span>
                        <button onClick={() => handleRemove(item.id)}
                          className="p-1.5 text-dark-400 hover:text-red-500 transition-colors touch-target">
                          <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={handleClearCart}
              className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-xl text-dark-800 mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                {couponData ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2">
                      <HiTag className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{couponData.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-700">-₹{discount.toFixed(0)}</span>
                      <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="input-field text-sm flex-1"
                        id="coupon-input"
                      />
                      <button onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode || !couponCode.trim()}
                        className="btn-outline text-sm !py-2 !px-4 whitespace-nowrap">
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {availableCoupons.length > 0 && (
                      <select 
                        className="input-field text-sm w-full bg-dark-50 cursor-pointer"
                        onChange={(e) => setCouponCode(e.target.value)}
                        value={couponCode}
                      >
                        <option value="">-- Select an available coupon --</option>
                        {availableCoupons.map((coupon) => (
                          <option key={coupon.id} value={coupon.code}>
                            {coupon.code} - {parseFloat(coupon.discount_percent).toFixed(0)}% OFF (Min ₹{parseFloat(coupon.min_order_amount).toFixed(0)})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-dark-600">
                  <span>Delivery</span>
                  {isFreeDelivery ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium">₹{deliveryCharge.toFixed(0)}</span>
                  )}
                </div>
                <hr className="border-dark-100" />
                <div className="flex justify-between text-lg font-display font-bold text-dark-800">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout', { state: { couponCode: couponData?.code } })}
                className="btn-primary w-full mt-6 !py-3 flex items-center justify-center gap-2"
                id="proceed-checkout">
                Proceed to Checkout <HiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
