import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph } from 'react-icons/hi';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../../utils/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discount_price: '',
    category: '', stock: '', weight: '', image_url: '',
    is_active: true, is_featured: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getProducts({ page_size: 100 });
      setProducts(res.data?.results || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productsAPI.getCategories();
      setCategories(res.data?.results || res.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, description: product.description || '', price: product.price,
        discount_price: product.discount_price || '', category: product.category,
        stock: product.stock, weight: product.weight || '', image_url: product.image_url || '',
        is_active: product.is_active, is_featured: product.is_featured,
      });
      setImagePreview(getProductImageUrl(product));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', discount_price: '',
        category: categories[0]?.id || '', stock: '', weight: '', image_url: '',
        is_active: true, is_featured: false,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear image_url when uploading a file
      setFormData({ ...formData, image_url: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          data.append(key, value);
        } else if (editingProduct && ['image_url', 'description', 'weight', 'discount_price'].includes(key)) {
          data.append(key, '');
        }
      });

      // Attach image file if selected
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, data);
        toast.success('Product updated!');
      } else {
        await productsAPI.createProduct(data);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Products</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto" id="add-product-btn">
          <HiPlus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 text-dark-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {products.map((product) => {
                const imgUrl = getProductImageUrl(product);
                return (
                  <tr key={product.id} className="hover:bg-dark-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🍿</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-800">{product.name}</p>
                          <p className="text-xs text-dark-400">{product.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-dark-600">{product.category_name}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">₹{product.effective_price}</span>
                      {product.discount_price && (
                        <span className="text-xs text-dark-400 line-through ml-1 hidden sm:inline">₹{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                        {product.stock != null ? product.stock : 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {product.is_featured && <span className="badge-warning mr-1">Featured</span>}
                      <span className={product.is_active !== false ? 'badge-success' : 'badge-danger'}>
                        {product.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openModal(product)} className="p-1.5 text-dark-400 hover:text-primary-500 transition-colors">
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-dark-400 hover:text-red-500 transition-colors">
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-xl">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field" rows="3" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Discount Price (₹)</label>
                  <input type="number" step="0.01" value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                    className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field" required>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Weight</label>
                <input value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="input-field" placeholder="e.g., 250g" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Product Image</label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full h-40 bg-dark-50 rounded-xl overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-dark-50 border border-dark-200 rounded-xl cursor-pointer hover:bg-dark-100 transition-colors text-sm font-medium text-dark-600">
                      <HiPhotograph className="w-5 h-5" />
                      Upload Image
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                    <span className="text-xs text-dark-400">or</span>
                  </div>

                  {/* Image URL */}
                  <input type="url" value={formData.image_url}
                    onChange={(e) => {
                      setFormData({...formData, image_url: e.target.value});
                      if (e.target.value) {
                        setImageFile(null);
                        setImagePreview(e.target.value);
                      }
                    }}
                    className="input-field" placeholder="https://example.com/product.jpg" />
                  <p className="text-xs text-dark-400">Upload a file or paste an image URL.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-dark-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-dark-700">Featured</span>
                </label>
              </div>
              <button type="submit" className="btn-primary w-full">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
