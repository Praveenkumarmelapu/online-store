import { Link } from 'react-router-dom';
import { HiShoppingCart, HiStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../utils/image';

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const imageUrl = getProductImageUrl(product);

  return (
    <Link to={`/products/${product.id}`} className="card group overflow-hidden" id={`product-card-${product.id}`}>
      {/* Image */}
      <div className="relative h-36 xs:h-44 sm:h-52 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl sm:text-6xl opacity-60">🍿</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount_percent > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
            {product.discount_percent}% OFF
          </div>
        )}

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-md">
            <HiStar className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> <span className="hidden xs:inline">Featured</span>
          </div>
        )}

        {/* Quick Add - visible on hover (desktop), always visible on mobile */}
        {product.in_stock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-full shadow-lg
                       sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0
                       transition-all duration-300 hover:bg-primary-500 hover:text-white text-dark-700 touch-target"
            title="Add to Cart"
          >
            <HiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-primary-500 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
          {product.category_name}
        </p>
        <h3 className="font-display font-semibold text-sm sm:text-base text-dark-800 group-hover:text-primary-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        {product.weight && (
          <p className="text-[10px] sm:text-xs text-dark-400 mt-0.5">{product.weight}</p>
        )}
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-display font-bold text-base sm:text-lg text-dark-800">
              ₹{product.effective_price}
            </span>
            {product.discount_price && (
              <span className="text-xs sm:text-sm text-dark-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          {!product.in_stock && (
            <span className="badge-danger text-[10px] sm:text-xs">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
