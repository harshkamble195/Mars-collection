import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination details
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter parameters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categoriesList = ['Hoodies', 'T-Shirts', 'Jackets', 'Footwear', 'Accessories'];

  // Sync state from query parameters on mount & URL updates
  useEffect(() => {
    const categoriesParam = searchParams.get('category');
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(','));
    } else {
      setSelectedCategories([]);
    }

    const searchParam = searchParams.get('search') || searchParams.get('keyword') || '';
    setSearchQuery(searchParam);

    const sortParam = searchParams.get('sort') || 'newest';
    setSortBy(sortParam);

    const pageParam = Number(searchParams.get('page')) || 1;
    setPage(pageParam);
  }, [searchParams]);

  // Fetch products whenever state parameters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 8,
          keyword: searchQuery,
          sort: sortBy,
        };

        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(',');
        }

        const data = await api.products.list(params);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [page, selectedCategories, searchQuery, sortBy]);

  // Push state updates back to URL
  const updateUrlParams = (newParams) => {
    const current = {};
    
    // Copy existing valid params
    if (selectedCategories.length > 0) current.category = selectedCategories.join(',');
    if (searchQuery) current.search = searchQuery;
    if (sortBy !== 'newest') current.sort = sortBy;
    if (page > 1) current.page = page;

    const merged = { ...current, ...newParams };
    
    // Clear empties
    Object.keys(merged).forEach((key) => {
      if (!merged[key] || merged[key] === '') delete merged[key];
    });

    setSearchParams(merged);
  };

  const handleCategoryToggle = (category) => {
    let updated;
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((c) => c !== category);
    } else {
      updated = [...selectedCategories, category];
    }
    setSelectedCategories(updated);
    setPage(1); // Reset page
    updateUrlParams({ category: updated.join(','), page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search: searchQuery, page: 1 });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setPage(1);
    updateUrlParams({ sort: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      updateUrlParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      {/* Title Header */}
      <div className="border-b border-gray-200 dark:border-luxury-border pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-wide">Shop Collection</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-light">
            Showing {products.length} of {totalProducts} premium garments
          </p>
        </div>

        {/* Clear Filters indicator */}
        {(selectedCategories.length > 0 || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-700 tracking-wider uppercase flex items-center gap-1"
          >
            Clear Active Filters <X size={12} />
          </button>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-8">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-luxury-charcoal dark:border-white px-3 py-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs tracking-wider focus:outline-none w-full pr-6 uppercase font-medium placeholder-gray-400"
            />
            <button type="submit" className="absolute right-3 text-luxury-charcoal dark:text-white">
              <Search size={14} />
            </button>
          </form>

          {/* Sorter */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-2">Sort By</h3>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full bg-transparent border border-gray-300 dark:border-luxury-border focus:border-gold px-3 py-2 text-xs tracking-wider uppercase font-medium focus:outline-none text-luxury-charcoal dark:text-white dark:bg-luxury-black"
            >
              <option value="newest">New Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Categories Selector */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-2">Category</h3>
            <div className="flex flex-col gap-2">
              {categoriesList.map((cat) => (
                <label key={cat} className="flex items-center gap-3 text-xs tracking-wider cursor-pointer group text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="accent-gold h-4 w-4 rounded-none border-gray-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="group-hover:text-gold transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Design Info Accent */}
          <div className="border border-gold/20 p-5 bg-beige-100/30 dark:bg-luxury-charcoal/30">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold">MARS Atelier</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-light leading-relaxed">
              All collections are released in limited numbers. Each item features signed authenticity certificates and is tailored to last.
            </p>
          </div>
        </aside>

        {/* Mobile Filters Bar */}
        <div className="lg:hidden flex justify-between items-center border border-gray-200 dark:border-luxury-border p-3 w-full mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold"
          >
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>
          <span className="text-[10px] uppercase text-gray-400 font-light">
            {totalProducts} Items Available
          </span>
        </div>

        {/* Catalog Grid (Right Side) */}
        <div className="lg:col-span-3 flex flex-col gap-16">
          
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-luxury-border">
              <h3 className="font-serif text-2xl tracking-wide">No items found</h3>
              <p className="text-xs text-gray-400 mt-2 font-light">
                Try loosening your filters, adjusting your search query, or checking back soon.
              </p>
              <button
                onClick={handleClearFilters}
                className="btn-gold mt-6"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Minimalist Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-luxury-border pt-8 mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest disabled:text-gray-300 dark:disabled:text-gray-700 hover:text-gold transition-colors"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="text-xs tracking-widest font-light text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest disabled:text-gray-300 dark:disabled:text-gray-700 hover:text-gold transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-80 h-full bg-white dark:bg-luxury-charcoal shadow-2xl flex flex-col p-6 animate-slide-up relative text-left overflow-y-auto">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-6 right-6 text-luxury-charcoal dark:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="font-serif text-2xl tracking-widest font-bold mt-4 mb-8">Refine Catalog</h2>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-luxury-charcoal dark:border-white px-3 py-2 mb-6">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs tracking-wider focus:outline-none w-full pr-6 uppercase font-medium placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 text-luxury-charcoal dark:text-white">
                <Search size={14} />
              </button>
            </form>

            {/* Mobile Sorter */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full bg-transparent border border-gray-300 dark:border-luxury-border focus:border-gold px-3 py-2 text-xs tracking-wider uppercase font-medium focus:outline-none text-luxury-charcoal dark:text-white dark:bg-luxury-black"
              >
                <option value="newest">New Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-2">Category</h3>
              <div className="flex flex-col gap-2">
                {categoriesList.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 text-xs tracking-wider cursor-pointer text-gray-600 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-gold h-4 w-4 rounded-none cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="btn-gold w-full text-center"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
