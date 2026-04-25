import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiShoppingCart, HiUser, HiMenu, HiX, HiSearch, HiLogout, HiHome, HiCube, HiClipboardList } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-dark-100 shadow-sm" ref={menuRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0" id="nav-logo">
              <span className="text-2xl sm:text-3xl">🍿</span>
              <span className="font-display font-bold text-lg sm:text-xl text-dark-800 group-hover:text-primary-500 transition-colors">
                SnackStore
              </span>
            </Link>

            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search snacks, dry fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-dark-200 bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all"
                  id="nav-search"
                />
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
              </div>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/products" className="text-dark-600 hover:text-primary-500 font-medium transition-colors text-sm" id="nav-products">
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="relative p-2 text-dark-600 hover:text-primary-500 transition-colors touch-target" id="nav-cart">
                    <HiShoppingCart className="w-6 h-6" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount > 9 ? '9+' : cartItemsCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative group">
                    <button className="flex items-center gap-1 text-dark-600 hover:text-primary-500 transition-colors" id="nav-user-menu">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {(user?.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-dark-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-dark-50">
                          <p className="font-medium text-sm text-dark-800">{user?.first_name} {user?.last_name}</p>
                          <p className="text-xs text-dark-400">{user?.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          My Orders
                        </Link>
                        {isAdmin && (
                          <a href="http://localhost:5174/" className="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 transition-colors">
                            Admin Dashboard
                          </a>
                        )}
                        <hr className="my-1 border-dark-100" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                          <HiLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-dark-600 hover:text-primary-500 font-medium text-sm transition-colors" id="nav-login">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !py-2 !px-4" id="nav-register">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Side */}
            <div className="flex items-center gap-1 md:hidden">
              {isAuthenticated && (
                <Link to="/cart" className="relative p-2 text-dark-600 touch-target" id="nav-cart-mobile">
                  <HiShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-dark-600 touch-target" id="nav-mobile-toggle">
                {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay */}
        <div className={`md:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bottom-0 bg-white z-[9999] transition-all duration-300 ease-in-out overflow-y-auto safe-bottom shadow-2xl ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="p-4 space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search snacks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-dark-200 bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                    autoFocus
                  />
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                </div>
              </form>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link to="/" className="flex items-center gap-3 py-3 px-4 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors">
                  <HiHome className="w-5 h-5" /> Home
                </Link>
                <Link to="/products" className="flex items-center gap-3 py-3 px-4 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors">
                  <HiCube className="w-5 h-5" /> All Products
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link to="/orders" className="flex items-center gap-3 py-3 px-4 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <HiClipboardList className="w-5 h-5" /> My Orders
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 py-3 px-4 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <HiUser className="w-5 h-5" /> My Profile
                    </Link>
                    {isAdmin && (
                      <a href="http://localhost:5174/" className="flex items-center gap-3 py-3 px-4 rounded-xl text-primary-600 font-medium hover:bg-primary-50 transition-colors">
                        <HiClipboardList className="w-5 h-5" /> Admin Dashboard
                      </a>
                    )}

                    <hr className="border-dark-100 my-2" />

                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-dark-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {(user?.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-dark-800 truncate">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium mt-2">
                      <HiLogout className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 pt-4">
                    <Link to="/login" className="block w-full text-center py-3 rounded-xl border-2 border-dark-200 text-dark-700 font-semibold hover:border-primary-400 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="block w-full btn-primary text-center">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
          </div>
        </div>
      </nav>
    </>
  );
}
