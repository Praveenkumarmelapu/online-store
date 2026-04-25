import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await productsAPI.getCategories();
      setCategories(res.data?.results || res.data || []);
    } catch (error) { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openModal = (cat = null) => {
    setEditingCat(cat);
    setFormData(cat ? { name: cat.name, description: cat.description || '' } : { name: '', description: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await productsAPI.updateCategory(editingCat.id, formData);
        toast.success('Category updated!');
      } else {
        await productsAPI.createCategory(formData);
        toast.success('Category created!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) { toast.error('Failed to save category'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await productsAPI.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) { toast.error('Cannot delete category with products'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl text-dark-800">Categories</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-dark-800">{cat.name}</h3>
              <div>
                <button onClick={() => openModal(cat)} className="p-1 text-dark-400 hover:text-primary-500"><HiPencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1 text-dark-400 hover:text-red-500"><HiTrash className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-sm text-dark-500 line-clamp-2">{cat.description || 'No description'}</p>
            <span className="badge-primary mt-3">{cat.products_count} products</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="card p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-xl">{editingCat ? 'Edit Category' : 'Add Category'}</h2>
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
              <button type="submit" className="btn-primary w-full">
                {editingCat ? 'Update' : 'Create'} Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
