import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { HiChartPie, HiShoppingBag, HiClipboardList, HiTag, HiUsers, HiMenu, HiX, HiLogout, HiExternalLink } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminLayout() {
  const { isAdmin, loading, logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) return <LoadingSpinner text="Verifying admin access..." />;
  if (!isAdmin) return <Navigate to="/login" replace />;

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HiChartPie },
    { name: 'Products', path: '/products', icon: HiShoppingBag },
    { name: 'Orders', path: '/orders', icon: HiClipboardList },
    { name: 'Coupons', path: '/coupons', icon: HiTag },
    { name: 'Users', path: '/users', icon: HiUsers },
    { name: 'Settings', path: '/settings', icon: HiMenu },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-dark-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-dark-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
          <span className="font-display font-bold text-lg">Admin</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-dark-600 touch-target" aria-label="Toggle Menu">
          {isSidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop + Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center gap-2">
            <span className="text-3xl">🍿</span>
            <span className="font-display font-bold text-xl">Admin Panel</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}

            <hr className="my-4 border-dark-800" />

            <a
              href="https://snackstore-frontend.onrender.com/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all font-medium"
            >
              <HiExternalLink className="w-5 h-5" />
              View Store
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium mt-auto"
            >
              <HiLogout className="w-5 h-5" />
              Logout
            </button>
          </nav>

          <div className="p-4 border-t border-dark-800">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.first_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-dark-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>


      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
