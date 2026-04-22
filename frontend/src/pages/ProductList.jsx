import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiFilter, HiX, HiAdjustments } from 'react-icons/hi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentOrdering = searchParams.get('ordering') || '-created_at';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productsAPI.getCategories();
        setCategories(res.data?.results || res.data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, ordering: currentOrdering };
        if (currentCategory) params.category = currentCategory;
        if (currentSearch) params.search = currentSearch;
        const res = await productsAPI.getProducts(params);
        setProducts(res.data?.results || []);
        const count = res.data?.count || 0;
        setTotalPages(Math.ceil(count / 12));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, currentCategory, currentSearch, currentOrdering]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    if (updates.category !== undefined || updates.search !== undefined || updates.ordering !== undefined) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = currentCategory || currentSearch;

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">All Products</h1>
        <p className="text-dark-500 mt-1 text-sm sm:text-base">Browse our collection of homemade goodies</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-semibold text-lg text-dark-800 mb-4">Categories</h3>
            <div className="space-y-2">
              <button onClick={() => updateParams({ category: '' })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? 'bg-primary-50 text-primary-600 font-medium' : 'text-dark-600 hover:bg-dark-50'}`}>
                All Products
              </button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => updateParams({ category: cat.id.toString() })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === cat.id.toString() ? 'bg-primary-50 text-primary-600 font-medium' : 'text-dark-600 hover:bg-dark-50'}`}>
                  {cat.name} <span className="text-dark-400">({cat.products_count})</span>
                </button>
              ))}
            </div>

            <hr className="my-5 border-dark-100" />

            <h3 className="font-display font-semibold text-lg text-dark-800 mb-4">Sort By</h3>
            <div className="space-y-2">
              {[
                { value: '-created_at', label: 'Newest First' },
                { value: 'price', label: 'Price: Low to High' },
                { value: '-price', label: 'Price: High to Low' },
                { value: 'name', label: 'Name: A-Z' },
              ].map((opt) => (
                <button key={opt.value} onClick={() => updateParams({ ordering: opt.value })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentOrdering === opt.value ? 'bg-primary-50 text-primary-600 font-medium' : 'text-dark-600 hover:bg-dark-50'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search + Mobile Filter Bar */}
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                defaultValue={currentSearch}
                onKeyDown={(e) => e.key === 'Enter' && updateParams({ search: e.target.value })}
                className="input-field !pl-10 !py-2.5"
                id="product-search"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-outline !px-3 !py-2.5 flex items-center gap-1 flex-shrink-0 text-sm">
              <HiAdjustments className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs sm:text-sm text-dark-500">Filters:</span>
              {currentCategory && (
                <span className="badge-primary flex items-center gap-1 text-xs">
                  {categories.find(c => c.id.toString() === currentCategory)?.name || 'Category'}
                  <HiX className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ category: '' })} />
                </span>
              )}
              {currentSearch && (
                <span className="badge-info flex items-center gap-1 text-xs">
                  "{currentSearch}"
                  <HiX className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ search: '' })} />
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">
                Clear All
              </button>
            </div>
          )}

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden card p-4 mb-4 animate-slide-down">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="touch-target"><HiX className="w-5 h-5" /></button>
              </div>

              {/* Categories as horizontal scrolling pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => { updateParams({ category: '' }); setShowFilters(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${!currentCategory ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-600'}`}>
                  All
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { updateParams({ category: cat.id.toString() }); setShowFilters(false); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${currentCategory === cat.id.toString() ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-600'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select value={currentOrdering} onChange={(e) => { updateParams({ ordering: e.target.value }); setShowFilters(false); }}
                className="input-field text-sm !py-2">
                <option value="-created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          )}

          {/* Products Grid - 2 cols on mobile, 3 on desktop */}
          {loading ? (
            <LoadingSpinner text="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <span className="text-5xl sm:text-6xl block mb-4">🔍</span>
              <h3 className="font-display font-semibold text-lg sm:text-xl text-dark-700 mb-2">No products found</h3>
              <p className="text-dark-500 text-sm">Try a different search or filter</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
                  <button disabled={currentPage <= 1}
                    onClick={() => updateParams({ page: (currentPage - 1).toString() })}
                    className="px-3 sm:px-4 py-2 rounded-lg border border-dark-200 text-dark-600 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors">
                    Prev
                  </button>
                  <span className="text-xs sm:text-sm text-dark-500 px-2 sm:px-4">
                    {currentPage} / {totalPages}
                  </span>
                  <button disabled={currentPage >= totalPages}
                    onClick={() => updateParams({ page: (currentPage + 1).toString() })}
                    className="px-3 sm:px-4 py-2 rounded-lg border border-dark-200 text-dark-600 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
