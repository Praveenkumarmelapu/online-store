import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { couponsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '', discount_percent: '', min_order_amount: 0,
    max_discount: '', expiry_date: '', usage_limit: '', is_active: true,
  });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await couponsAPI.getCoupons();
      setCoupons(res.data?.results || res.data || []);
    } catch (error) { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code, discount_percent: coupon.discount_percent,
        min_order_amount: coupon.min_order_amount, max_discount: coupon.max_discount || '',
        expiry_date: coupon.expiry_date, usage_limit: coupon.usage_limit || '',
        is_active: coupon.is_active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '', discount_percent: '', min_order_amount: 0,
        max_discount: '', expiry_date: '', usage_limit: '', is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (!data.max_discount) delete data.max_discount;
    if (!data.usage_limit) delete data.usage_limit;

    try {
      if (editingCoupon) {
        await couponsAPI.updateCoupon(editingCoupon.id, data);
        toast.success('Coupon updated!');
      } else {
        await couponsAPI.createCoupon(data);
        toast.success('Coupon created!');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) { toast.error('Failed to save coupon'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponsAPI.deleteCoupon(id);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) { toast.error('Failed to delete coupon'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl text-dark-800">Coupons</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Coupon
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 text-dark-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Discount</th>
                <th className="text-left px-4 py-3 font-medium">Min Order</th>
                <th className="text-left px-4 py-3 font-medium">Max Discount</th>
                <th className="text-left px-4 py-3 font-medium">Expiry</th>
                <th className="text-left px-4 py-3 font-medium">Usage</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-dark-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary-600">{coupon.code}</td>
                  <td className="px-4 py-3 font-medium">{coupon.discount_percent}%</td>
                  <td className="px-4 py-3 text-dark-600">₹{coupon.min_order_amount}</td>
                  <td className="px-4 py-3 text-dark-600">{coupon.max_discount ? `₹${coupon.max_discount}` : '—'}</td>
                  <td className="px-4 py-3 text-dark-600">{new Date(coupon.expiry_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-4 py-3">{coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}</td>
                  <td className="px-4 py-3">
                    <span className={coupon.is_valid ? 'badge-success' : 'badge-danger'}>
                      {coupon.is_valid ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openModal(coupon)} className="p-1.5 text-dark-400 hover:text-primary-500"><HiPencil className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-dark-400 hover:text-red-500"><HiTrash className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="card p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-xl">{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button onClick={() => setShowModal(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Coupon Code</label>
                <input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="input-field font-mono" required placeholder="SAVE20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Discount %</label>
                  <input type="number" step="0.01" value={formData.discount_percent}
                    onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                    className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Min Order (₹)</label>
                  <input type="number" value={formData.min_order_amount}
                    onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                    className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Max Discount (₹)</label>
                  <input type="number" value={formData.max_discount}
                    onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Usage Limit</label>
                  <input type="number" value={formData.usage_limit}
                    onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Expiry Date</label>
                <input type="date" value={formData.expiry_date}
                  onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  className="input-field" required />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded" />
                <span className="text-sm text-dark-700">Active</span>
              </label>
              <button type="submit" className="btn-primary w-full">
                {editingCoupon ? 'Update' : 'Create'} Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
