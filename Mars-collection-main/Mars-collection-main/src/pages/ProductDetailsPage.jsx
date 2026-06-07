import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Minus, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProductDetailsSkeleton } from '../components/LoadingSkeleton';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, toggleWishlist, isInWishlist, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.products.details(id);
        setProduct(data);
        // Default select first size and color
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (error) {
        showToast(error.message || 'Product not found', 'error');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-28">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const finalPrice = product.price * (1 - product.discount / 100);

  const handleWishlistClick = async () => {
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

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showToast('Product is out of stock', 'warning');
      return;
    }
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }
    if (!selectedColor) {
      showToast('Please select a color', 'warning');
      return;
    }

    addToCart(product, qty, selectedSize, selectedColor);
    showToast(`Added ${qty}x ${product.name} (${selectedSize}) to bag`, 'success');
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      showToast('Product is out of stock', 'warning');
      return;
    }
    addToCart(product, qty, selectedSize, selectedColor);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter a review comment', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.products.review(product._id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      showToast('Review submitted successfully!', 'success');
      
      // Reload product details to show new review
      const updatedProduct = await api.products.details(product._id);
      setProduct(updatedProduct);
      
      // Clear form
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      showToast(error.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest hover:text-gold transition-colors mb-10 text-gray-500"
      >
        <ArrowLeft size={16} /> Back to Browse
      </button>

      {/* Main product wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] bg-[#f6f6f6] dark:bg-[#121212] overflow-hidden border border-gray-100 dark:border-luxury-border">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square overflow-hidden bg-[#f6f6f6] dark:bg-[#121212] border transition-all duration-200 ${
                    activeImageIndex === i ? 'border-luxury-charcoal dark:border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specs & Buy Panel */}
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">{product.brand}</span>
            <h1 className="font-serif text-3xl lg:text-4xl tracking-wide font-medium">{product.name}</h1>
            <p className="text-xs uppercase text-gray-400 font-light">{product.category}</p>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-serif tracking-wider font-semibold">
              ${finalPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through tracking-wider">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-[9px] bg-gold text-luxury-black font-bold uppercase tracking-widest px-2 py-0.5">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Rating Breakout */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.round(product.rating) ? 'text-gold' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-luxury-charcoal dark:text-gray-300">
                {product.rating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-gray-400">({product.numReviews} Reviews)</span>
            </div>
          )}

          <hr className="border-gray-200 dark:border-luxury-border" />

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400">Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Colors Selector */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => {
                // If it's a hex value, render block; else render text
                const isHex = color.startsWith('#');
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-7 px-3 text-[10px] uppercase tracking-wider font-semibold border flex items-center justify-center transition-all ${
                      selectedColor === color
                        ? 'border-luxury-charcoal dark:border-white bg-luxury-charcoal text-white dark:bg-white dark:text-luxury-black'
                        : 'border-gray-300 dark:border-luxury-border hover:border-luxury-charcoal dark:hover:border-white'
                    }`}
                  >
                    {isHex ? (
                      <div className="flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 border border-black/10 inline-block" style={{ backgroundColor: color }} />
                        <span>{color}</span>
                      </div>
                    ) : (
                      color
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes Selector */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 w-12 text-xs uppercase tracking-wider border flex items-center justify-center transition-all ${
                    selectedSize === size
                      ? 'border-luxury-charcoal dark:border-white bg-luxury-charcoal text-white dark:bg-white dark:text-luxury-black font-bold'
                      : 'border-gray-300 dark:border-luxury-border hover:border-luxury-charcoal dark:hover:border-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400">Quantity</h3>
              <div className="flex items-center gap-3 border border-gray-300 dark:border-luxury-border w-32 py-2 justify-around">
                <button
                  onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
                  className="text-gray-500 hover:text-luxury-charcoal dark:hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((prev) => Math.min(prev + 1, product.stock))}
                  className="text-gray-500 hover:text-luxury-charcoal dark:hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Call To Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {product.stock > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={handleAddToCart} className="btn-gold py-4 text-center">
                  Add to Bag
                </button>
                <button onClick={handleBuyNow} className="btn-outline py-4 text-center">
                  Buy It Now
                </button>
              </div>
            ) : (
              <button disabled className="btn-gold bg-gray-400 dark:bg-gray-700 py-4 text-center text-white cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Wishlist toggle */}
            <button
              onClick={handleWishlistClick}
              className="flex items-center justify-center gap-2 border border-gray-200 dark:border-luxury-border py-3 hover:bg-gray-50 dark:hover:bg-luxury-black/30 transition-colors uppercase tracking-widest text-[10px] font-semibold text-gray-500 hover:text-luxury-charcoal dark:hover:text-white"
            >
              <Heart size={14} className={isWishlisted ? 'fill-gold text-gold' : ''} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-4 border-t border-gray-200 dark:border-luxury-border pt-6 flex flex-col gap-3 text-xs text-gray-500 dark:text-gray-400 font-light">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-gold flex-shrink-0" />
              <span>Complimentary insured shipping in customized MARS boxes.</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-gold flex-shrink-0" />
              <span>Original certification tags and product serial key included.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <section className="mt-20 border-t border-gray-200 dark:border-luxury-border pt-16">
        <h2 className="font-serif text-2xl tracking-wide mb-10">Client Reviews ({product.reviews.length})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            {product.reviews.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 dark:border-luxury-border">
                <p className="text-xs text-gray-400 uppercase tracking-widest">No reviews for this product yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-luxury-border">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="py-6 first:pt-0 last:pb-0 text-left">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-xs uppercase tracking-widest font-semibold">{rev.name}</h4>
                      <span className="text-[10px] text-gray-400 font-light">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex text-gold gap-0.5 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          className="text-gold"
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-300 font-light mt-3 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Write Form */}
          <div className="bg-beige-100/30 dark:bg-luxury-charcoal/30 p-6 border border-gray-100 dark:border-luxury-border h-fit">
            <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4">
              Write a Review
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-gold focus:outline-none"
                      >
                        <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Your Review</label>
                  <textarea
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your experience with this garment's fit, feel, and weight..."
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-gold w-full py-3.5 text-center mt-2"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500 font-light">Please sign in to submit a verification review.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-outline w-full py-3 mt-4 text-center"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
