import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();
  const { showToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = isInWishlist(product._id);
  const finalPrice = product.price * (1 - product.discount / 100);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const added = await toggleWishlist(product);
      showToast(
        added ? 'Added to wishlist' : 'Removed from wishlist',
        added ? 'success' : 'info'
      );
    } catch (error) {
      showToast(error.message || 'Please log in to manage your wishlist', 'error');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      showToast('Product is out of stock', 'warning');
      return;
    }

    // Default to first size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];

    addToCart(product, 1, defaultSize, defaultColor);
    showToast(`Quick Added ${product.name} (${defaultSize}) to bag`, 'success');
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col w-full h-full relative bg-white dark:bg-luxury-charcoal"
      onMouseEnter={() => product.images[1] && setCurrentImageIndex(1)}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[3/4] w-full bg-[#f6f6f6] dark:bg-[#121212] overflow-hidden">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-gold text-luxury-black font-semibold text-[9px] uppercase tracking-widest px-2 py-1 z-10">
            {product.discount}% OFF
          </span>
        )}

        {/* Stock Status Badge */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-luxury-black text-white text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/20 font-medium">
              Out of stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <span className="absolute top-3 right-3 bg-red-500 text-white font-semibold text-[8px] uppercase tracking-wider px-2 py-1 z-10">
            Low Stock
          </span>
        ) : null}

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleWishlistClick}
          className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-luxury-charcoal/90 text-luxury-charcoal dark:text-white rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white dark:hover:bg-luxury-black z-20 shadow-sm"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-gold text-gold' : 'text-current'}
          />
        </button>

        {/* Quick Add Bag Button overlay */}
        {product.stock > 0 && (
          <button
            onClick={handleQuickAdd}
            className="absolute inset-x-0 bottom-0 bg-luxury-black/90 dark:bg-white/90 text-white dark:text-luxury-black font-medium text-[10px] uppercase tracking-widest py-3 text-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold dark:hover:bg-gold hover:text-luxury-black dark:hover:text-luxury-black z-10"
          >
            Quick Add
          </button>
        )}
      </div>

      {/* Info Block */}
      <div className="flex flex-col pt-4 pb-2 px-1 flex-grow">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          {product.brand} &bull; {product.category}
        </span>
        <h3 className="font-sans text-sm font-medium tracking-wide mt-1 group-hover:text-gold transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>

        {/* Rating stars if reviews exist */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  className={i < Math.round(product.rating) ? 'text-gold' : 'text-gray-300 dark:text-gray-600'}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.numReviews})</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-semibold tracking-wider font-serif">
            ${finalPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-[11px] text-gray-400 line-through tracking-wider">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
