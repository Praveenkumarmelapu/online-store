import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', username: '', password: '', password2: '',
    first_name: '', last_name: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-4xl sm:text-5xl block mb-2 sm:mb-3">🍿</span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Create Account</h1>
          <p className="text-dark-500 mt-1 text-sm sm:text-base">Join SnackStore for delicious treats</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                  className="input-field" placeholder="John" required id="register-first-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                  className="input-field" placeholder="Doe" required id="register-last-name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Username</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input type="text" name="username" value={formData.username} onChange={handleChange}
                  className="input-field !pl-10" placeholder="johndoe" required id="register-username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="input-field !pl-10" placeholder="you@example.com" required id="register-email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="input-field !pl-10" placeholder="9876543210" id="register-phone" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  className="input-field !pl-10 !pr-10" placeholder="••••••••" required id="register-password" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 focus:outline-none"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input type={showPassword2 ? "text" : "password"} name="password2" value={formData.password2} onChange={handleChange}
                  className="input-field !pl-10 !pr-10" placeholder="••••••••" required id="register-password2" />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 focus:outline-none"
                >
                  {showPassword2 ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 text-base" id="register-submit">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
