import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiPencil, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">My Profile</h1>
            <p className="text-dark-500 text-xs sm:text-sm mt-1">Manage your account information</p>
          </div>
          <button onClick={() => setEditing(!editing)}
            className={`${editing ? 'btn-outline' : 'btn-primary'} text-xs sm:text-sm flex items-center justify-center gap-1 !py-2 !px-4 self-start sm:self-center`}>
            {editing ? 'Cancel' : <><HiPencil className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>

        {/* Profile Card */}
        <div className="card p-5 sm:p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-dark-100">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg">
              {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-semibold text-xl text-dark-800">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-dark-500 text-sm">{user?.email}</p>
              {user?.is_staff && <span className="badge-primary mt-1">Admin</span>}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-dark-500 flex items-center gap-1 mb-1">
                <HiUser className="w-4 h-4" /> First Name
              </label>
              {editing ? (
                <input name="first_name" value={formData.first_name} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.first_name || '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 flex items-center gap-1 mb-1">
                <HiUser className="w-4 h-4" /> Last Name
              </label>
              {editing ? (
                <input name="last_name" value={formData.last_name} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.last_name || '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 flex items-center gap-1 mb-1">
                <HiMail className="w-4 h-4" /> Email
              </label>
              <p className="text-dark-800 font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 flex items-center gap-1 mb-1">
                <HiPhone className="w-4 h-4" /> Phone
              </label>
              {editing ? (
                <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.phone || '—'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-dark-500 flex items-center gap-1 mb-1">
                <HiLocationMarker className="w-4 h-4" /> Address
              </label>
              {editing ? (
                <textarea name="address" value={formData.address} onChange={handleChange} className="input-field" rows="2" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.address || '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 mb-1 block">City</label>
              {editing ? (
                <input name="city" value={formData.city} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.city || '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 mb-1 block">State</label>
              {editing ? (
                <input name="state" value={formData.state} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.state || '—'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-dark-500 mb-1 block">Pincode</label>
              {editing ? (
                <input name="pincode" value={formData.pincode} onChange={handleChange} className="input-field" />
              ) : (
                <p className="text-dark-800 font-medium">{user?.pincode || '—'}</p>
              )}
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
                <HiCheck className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-dark-400 mt-4 text-center">
          Member since {new Date(user?.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
