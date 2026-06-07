import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Sun, Moon, Menu, X, Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, wishlist, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // User Dropdown state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown and search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const data = await api.products.suggestions(searchQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSearchOpen(false);
    setShowSuggestions(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-luxury-black/95 backdrop-blur-md shadow-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-luxury-charcoal dark:text-white"
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="font-serif text-2xl md:text-3xl tracking-widest font-bold text-luxury-charcoal dark:text-white uppercase"
          >
            MARS
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-medium">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <Link to="/shop?category=Hoodies" className="hover:text-gold transition-colors">Hoodies</Link>
            <Link to="/shop?category=Footwear" className="hover:text-gold transition-colors">Footwear</Link>
            <Link to="/shop?category=Accessories" className="hover:text-gold transition-colors">Accessories</Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 md:gap-5 text-luxury-charcoal dark:text-white">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-gold transition-colors p-1"
            >
              <Search size={18} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hover:text-gold transition-colors p-1 hidden sm:block"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist Link */}
            <Link to="/dashboard?tab=wishlist" className="relative hover:text-gold transition-colors p-1">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-luxury-black font-semibold text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative hover:text-gold transition-colors p-1">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-black dark:bg-white text-white dark:text-luxury-black font-semibold text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="hover:text-gold transition-colors p-1 flex items-center gap-1"
              >
                <User size={18} />
                {isAuthenticated && <span className="hidden lg:inline text-[9px] uppercase tracking-wider font-medium text-gray-500">Hi, {user.name.split(' ')[0]}</span>}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-luxury-charcoal border border-gray-100 dark:border-luxury-border shadow-xl z-50 text-left rounded-sm py-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-luxury-border">
                        <p className="text-xs font-semibold text-luxury-charcoal dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-xs uppercase tracking-wider text-gold hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors"
                      >
                        My Dashboard
                      </Link>

                      <Link
                        to="/dashboard?tab=orders"
                        className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors"
                      >
                        Order History
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-xs uppercase tracking-wider text-red-500 hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors border-t border-gray-100 dark:border-luxury-border mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2.5 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2.5 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-luxury-black transition-colors"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Search Panel overlay */}
        {searchOpen && (
          <div className="absolute top-full inset-x-0 bg-white dark:bg-luxury-black border-b border-gray-100 dark:border-luxury-border shadow-md animate-slide-down py-6 z-40">
            <div className="max-w-3xl mx-auto px-6 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-gray-200 dark:border-luxury-border px-4 py-3">
                <Search size={18} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products (e.g. Signature Box Hoodie, sneakers)..."
                  className="w-full bg-transparent focus:outline-none text-sm text-luxury-charcoal dark:text-white placeholder-gray-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-luxury-charcoal dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </form>

              {/* Autocomplete Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-6 right-6 mt-1.5 bg-white dark:bg-luxury-charcoal border border-gray-200 dark:border-luxury-border shadow-2xl z-[99] rounded-sm py-2 max-h-96 overflow-y-auto">
                  <p className="px-4 py-1.5 text-[9px] uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-100 dark:border-luxury-border">Suggestions</p>
                  {suggestions.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => handleSuggestionClick(p._id)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-luxury-black cursor-pointer border-b border-gray-50 dark:border-luxury-border/50 last:border-0"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover" />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-luxury-charcoal dark:text-white line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.brand} &bull; ${p.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-start md:hidden animate-fade-in">
          <div className="w-80 h-full bg-white dark:bg-luxury-charcoal shadow-2xl flex flex-col p-6 animate-slide-up duration-300 relative text-left">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-luxury-charcoal dark:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="font-serif text-2xl tracking-widest font-bold mt-4 mb-8">MARS</h2>

            <nav className="flex flex-col gap-6 text-[13px] uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-8">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop Catalog</Link>
              <Link to="/shop?category=Hoodies">Hoodies</Link>
              <Link to="/shop?category=T-Shirts">T-Shirts</Link>
              <Link to="/shop?category=Jackets">Jackets</Link>
              <Link to="/shop?category=Footwear">Footwear</Link>
              <Link to="/shop?category=Accessories">Accessories</Link>
            </nav>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 text-xs uppercase tracking-wider font-medium"
              >
                {darkMode ? (
                  <>
                    <Sun size={16} /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} /> Dark Mode
                  </>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-xs uppercase tracking-wider font-medium">My Dashboard</Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs uppercase tracking-wider font-medium text-red-500 mt-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xs uppercase tracking-wider font-medium">Sign In</Link>
                  <Link to="/register" className="text-xs uppercase tracking-wider font-medium">Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
