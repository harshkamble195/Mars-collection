import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    cartItems,
    promoCode,
    discountPercent,
    updateCartQty,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    itemsPrice,
    discountPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = applyPromoCode(couponInput);
    if (result.success) {
      showToast(result.message, 'success');
      setCouponInput('');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleQuantityChange = (item, direction) => {
    const newQty = direction === 'inc' ? item.qty + 1 : item.qty - 1;
    if (newQty > item.stock) {
      showToast(`Only ${item.stock} items available in stock`, 'warning');
      return;
    }
    updateCartQty(item.product, item.size, item.color, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-36 text-center">
        <h2 className="font-serif text-3xl tracking-wide">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-400 mt-2 font-light uppercase tracking-wider">
          You haven't added any luxury pieces to your bag yet.
        </p>
        <Link to="/shop" className="btn-gold inline-block mt-8">
          Explore The Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      <h1 className="font-serif text-4xl tracking-wide border-b border-gray-200 dark:border-luxury-border pb-6 mb-10">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item, idx) => {
            const finalItemPrice = item.price * (1 - item.discount / 100);
            return (
              <div
                key={`${item.product}-${item.size}-${item.color}`}
                className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 dark:border-luxury-border pb-6 last:border-b-0 last:pb-0"
              >
                {/* Item Image */}
                <Link to={`/product/${item.product}`} className="w-full sm:w-28 aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-luxury-black border border-gray-100 dark:border-luxury-border/30 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                {/* Item Info & Action Row */}
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-sans text-sm font-semibold tracking-wide hover:text-gold transition-colors">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5 flex gap-3">
                        <span>Size: <strong className="text-luxury-charcoal dark:text-white">{item.size}</strong></span>
                        <span>Color: <strong className="text-luxury-charcoal dark:text-white">{item.color}</strong></span>
                      </p>
                    </div>
                    {/* Trash Delete button */}
                    <button
                      onClick={() => {
                        removeFromCart(item.product, item.size, item.color);
                        showToast(`Removed ${item.name} from bag`, 'info');
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-150 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity & Total Price row */}
                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity Picker */}
                    <div className="flex items-center gap-3 border border-gray-300 dark:border-luxury-border px-3 py-1.5">
                      <button
                        onClick={() => handleQuantityChange(item, 'dec')}
                        className="text-gray-500 hover:text-luxury-charcoal dark:hover:text-white p-0.5"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-semibold w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 'inc')}
                        className="text-gray-500 hover:text-luxury-charcoal dark:hover:text-white p-0.5"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal Item Cost */}
                    <div className="text-right">
                      <span className="text-sm font-serif tracking-wider font-semibold">
                        ${(finalItemPrice * item.qty).toFixed(2)}
                      </span>
                      {item.discount > 0 && (
                        <p className="text-[10px] text-gray-400 line-through">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-beige-100/30 dark:bg-luxury-charcoal/30 p-6 border border-gray-100 dark:border-luxury-border">
            <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300 font-light pb-4 border-b border-gray-100 dark:border-luxury-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-luxury-charcoal dark:text-white">${itemsPrice.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span className="font-semibold">-${discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-luxury-charcoal dark:text-white">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span className="font-semibold text-luxury-charcoal dark:text-white">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-[9px] text-gray-400 text-left">Add ${(150 - itemsPrice).toFixed(2)} more to qualify for Free Shipping.</p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline font-serif text-lg font-bold py-4 text-luxury-charcoal dark:text-white">
              <span>Estimated Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* Coupon Code Forms */}
            <div className="mt-4 border-t border-gray-100 dark:border-luxury-border pt-4">
              {promoCode ? (
                <div className="flex items-center justify-between bg-gold/10 text-gold text-xs px-3 py-2 border border-gold/20">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Tag size={12} /> {promoCode} APPLIED
                  </span>
                  <button
                    onClick={() => {
                      removePromoCode();
                      showToast('Promo code removed', 'info');
                    }}
                    className="underline text-[10px] hover:text-gold-dark font-medium uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. MARS10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none uppercase font-semibold"
                  />
                  <button type="submit" className="bg-luxury-charcoal hover:bg-gold text-white hover:text-luxury-black text-xs font-semibold px-4 py-2 uppercase transition-all duration-300">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-gold w-full text-center py-4 flex items-center justify-center gap-2 mt-6"
            >
              Proceed to Checkout <ArrowRight size={14} />
            </button>
          </div>

          {/* Assistance Accent */}
          <div className="text-center py-4 border border-dashed border-gray-200 dark:border-luxury-border text-xs text-gray-400 font-light leading-relaxed">
            Need assistance completing your order? <br />
            Email us at <strong className="text-gray-600 dark:text-gray-200">concierge@marscollection.com</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
