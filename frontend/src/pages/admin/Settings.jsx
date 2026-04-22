import { useState, useEffect } from 'react';
import { HiTruck, HiInformationCircle } from 'react-icons/hi';
import { settingsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    delivery_charge: '',
    free_delivery_threshold: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      setSettings(res.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Store Settings</h1>
        <p className="text-dark-500 mt-1 text-sm">Configure delivery charges and store-wide thresholds.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              <HiTruck className="w-6 h-6" />
            </div>
            <h2 className="font-display font-semibold text-xl text-dark-800">Delivery Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Default Delivery Charge (₹)
              </label>
              <input
                type="number"
                name="delivery_charge"
                value={settings.delivery_charge}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 79"
                required
              />
              <p className="text-xs text-dark-400 mt-1.5">
                The flat fee charged for delivery if the order total is below the threshold.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                name="free_delivery_threshold"
                value={settings.free_delivery_threshold}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 499"
                required
              />
              <p className="text-xs text-dark-400 mt-1.5">
                Orders above this amount will have free delivery.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <HiInformationCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Changes applied here will reflect instantly on the Cart and Checkout pages for all customers.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 !py-3 font-semibold shadow-lg shadow-primary-500/30"
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
