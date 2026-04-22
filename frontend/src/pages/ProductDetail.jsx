import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiShoppingCart, HiArrowLeft, HiMinus, HiPlus, HiStar } from 'react-icons/hi';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../utils/image';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getProduct(id);
        setProduct(res.data);
      } catch (error) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (!product) return (
    <div className="page-container text-center py-20">
      <span className="text-6xl block mb-4">😕</span>
      <h2 className="font-display text-2xl font-bold text-dark-800 mb-2">Product Not Found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-flex items-center gap-2">
        <HiArrowLeft /> Back to Products
      </Link>
    </div>
  );

  const imageUrl = getProductImageUrl(product);

  return (
    <div className="page-container animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-dark-500">
        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-500 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-dark-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-9xl opacity-40">🍿</span>
              </div>
            )}
          </div>
          {product.discount_percent > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-lg shadow-lg">
              {product.discount_percent}% OFF
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg">
              <HiStar className="w-5 h-5" /> Featured
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="badge-primary text-sm mb-3">{product.category_name}</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-dark-900 mt-2">
            {product.name}
          </h1>

          {product.weight && (
            <p className="text-dark-400 mt-1">Weight: {product.weight}</p>
          )}

          {/* Price */}
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display font-extrabold text-4xl text-dark-900">
              ₹{product.effective_price}
            </span>
            {product.discount_price && (
              <span className="text-xl text-dark-400 line-through mb-1">
                ₹{product.price}
              </span>
            )}
            {product.discount_percent > 0 && (
              <span className="text-green-600 font-semibold text-lg mb-1">
                Save ₹{(product.price - product.effective_price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {product.in_stock ? (
              <span className="badge-success">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="badge-danger">✕ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-display font-semibold text-lg text-dark-800 mb-2">Description</h3>
            <p className="text-dark-500 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>

          {/* Add to Cart */}
          {product.in_stock && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-dark-600">Quantity:</span>
                <div className="flex items-center border border-dark-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-dark-50 transition-colors">
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2 font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 hover:bg-dark-50 transition-colors">
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} disabled={addingToCart}
                className="btn-primary w-full sm:w-auto !py-3 !px-10 text-lg flex items-center justify-center gap-3"
                id="add-to-cart-btn">
                <HiShoppingCart className="w-6 h-6" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
