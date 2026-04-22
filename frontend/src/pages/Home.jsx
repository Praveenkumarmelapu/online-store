import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiShieldCheck, HiTruck, HiSparkles, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const bannerSlides = [
  {
    image: '/images/hero-banner.png',
    tagline: 'Freshly Made • Delivered Fresh',
    title: 'Homemade Snacks,',
    highlight: 'Delivered to Your Door',
    description: 'Discover the finest collection of traditional Indian snacks, premium dry fruits, and freshly baked treats.',
    cta: { text: 'Shop Now', link: '/products' },
    ctaSecondary: { text: 'View Bestsellers', link: '/products?is_featured=true' },
  },
  {
    image: '/images/promo-banner.png',
    tagline: 'Premium Collection',
    title: 'Dry Fruits &',
    highlight: 'Mixed Nuts',
    description: 'Hand-picked premium quality almonds, cashews, pistachios, walnuts and more — sourced from the best farms.',
    cta: { text: 'Explore Now', link: '/products?category=2' },
    ctaSecondary: null,
  },
  {
    image: '/images/categories-banner.png',
    tagline: 'Traditional Favorites',
    title: 'Sweets &',
    highlight: 'Namkeen Delights',
    description: 'Authentic homemade sweets and savory snacks made with love — just like grandma used to make.',
    cta: { text: 'Browse All', link: '/products' },
    ctaSecondary: null,
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getFeaturedProducts(),
          productsAPI.getCategories(),
        ]);
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data?.results || categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-advance banner slides
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const categoryEmojis = {
    'Namkeen & Mixtures': '🥜',
    'Dry Fruits & Nuts': '🌰',
    'Sweets': '🍬',
    'Chips & Crisps': '🍟',
    'Pickles & Chutneys': '🫙',
    'Cookies & Biscuits': '🍪',
  };

  const slide = bannerSlides[currentSlide];

  return (
    <div className="animate-fade-in">
      {/* Announcement Bar */}
      <div className="bg-dark-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <HiSparkles className="w-4 h-4 text-primary-400 flex-shrink-0" />
            <span>Free Delivery on orders above ₹499</span>
            <span className="hidden sm:inline text-dark-400">•</span>
            <span className="hidden sm:inline">Use code <span className="text-primary-400 font-bold">WELCOME10</span> for 10% off</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden bg-dark-900">
        <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px]">
          {/* Banner Image */}
          <img
            src={slide.image}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            loading="eager"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/50 to-dark-900/20 sm:from-dark-900/70 sm:via-dark-900/40 sm:to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl animate-fade-in" key={currentSlide}>
              <div className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm text-primary-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-5">
                <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                {slide.tagline}
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                {slide.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                  {slide.highlight}
                </span>
              </h1>
              <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-dark-300 leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                {slide.description}
              </p>
              <div className="mt-4 sm:mt-7 flex flex-wrap gap-3">
                <Link to={slide.cta.link}
                  className="btn-primary flex items-center gap-2 text-sm sm:text-base !py-2.5 sm:!py-3 !px-5 sm:!px-8 animate-pulse-glow"
                  id="hero-shop-now">
                  {slide.cta.text} <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                {slide.ctaSecondary && (
                  <Link to={slide.ctaSecondary.link}
                    className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-2.5 sm:py-3 px-5 sm:px-8 rounded-xl transition-all text-sm sm:text-base">
                    {slide.ctaSecondary.text}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-20"
            aria-label="Previous slide">
            <HiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-20"
            aria-label="Next slide">
            <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {bannerSlides.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 h-2.5 bg-primary-500'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { icon: HiTruck, title: 'Free Delivery', desc: 'Orders above ₹499' },
              { icon: HiShieldCheck, title: '100% Fresh', desc: 'No preservatives' },
              { icon: HiSparkles, title: 'Premium Quality', desc: 'Hand-picked' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-dark-800">{item.title}</p>
                  <p className="text-xs text-dark-400 hidden sm:block">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="page-container">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Shop by Category</h2>
          <p className="text-dark-500 mt-1 sm:mt-2 text-sm sm:text-base">Explore our wide range of homemade delights</p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:overflow-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="card p-4 sm:p-6 text-center group hover:border-primary-200 border border-transparent min-w-[120px] sm:min-w-0 flex-shrink-0"
              id={`home-category-${category.id}`}
            >
              <span className="text-3xl sm:text-4xl block mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                {categoryEmojis[category.name] || '🛒'}
              </span>
              <h3 className="font-semibold text-xs sm:text-sm text-dark-700 group-hover:text-primary-600 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <p className="text-xs text-dark-400 mt-0.5">{category.products_count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container bg-dark-50">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Featured Products</h2>
            <p className="text-dark-500 mt-1 text-sm sm:text-base">Our top picks, handcrafted for you</p>
          </div>
          <Link to="/products" className="btn-outline text-xs sm:text-sm hidden sm:flex items-center gap-1 !py-2 !px-4">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading delicious snacks..." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8 sm:hidden">
              <Link to="/products" className="btn-primary inline-flex items-center gap-1 text-sm">
                View All Products <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[200px] sm:h-[280px] md:h-[320px]">
          <img src="/images/promo-banner.png" alt="Special Offer" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  🎉 Limited Time Offer
                </span>
                <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl text-white mb-2 sm:mb-3">
                  Get 10% Off Your First Order!
                </h2>
                <p className="text-white/80 text-xs sm:text-base mb-4 sm:mb-6 line-clamp-2">
                  Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">WELCOME10</span> at checkout
                </p>
                <Link to="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold py-2.5 sm:py-3 px-5 sm:px-8 rounded-xl hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base">
                  Sign Up Now <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="page-container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-dark-800">Why Choose SnackStore?</h2>
          <p className="text-dark-500 mt-1 sm:mt-2 text-sm sm:text-base">What makes us special</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { emoji: '🏠', title: 'Homemade Fresh', desc: 'Every snack is handcrafted in small batches to ensure freshness and quality.' },
            { emoji: '🌿', title: 'No Preservatives', desc: 'We use only natural ingredients — no artificial colors, flavors, or preservatives.' },
            { emoji: '📦', title: 'Secure Packaging', desc: 'Your snacks arrive fresh and crispy with our special vacuum-sealed packaging.' },
            { emoji: '💝', title: 'Made with Love', desc: 'Traditional family recipes passed down through generations of expert cooks.' },
          ].map((item, i) => (
            <div key={i} className="card p-5 sm:p-6 text-center group hover:border-primary-200 border border-transparent">
              <span className="text-3xl sm:text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
              <h3 className="font-display font-semibold text-sm sm:text-base text-dark-800 mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-dark-500 leading-relaxed line-clamp-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
