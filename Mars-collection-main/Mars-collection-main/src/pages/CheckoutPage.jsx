import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, DollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, itemsPrice, taxPrice, shippingPrice, discountPrice, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  // Contact State
  const [phone, setPhone] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  // Pre-fill user profile address if logged in
  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Please sign in to complete your checkout.', 'warning');
      navigate('/login?redirect=checkout');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/shop');
      return;
    }

    if (user && user.address) {
      setShippingAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zip: user.address.zip || '',
        country: user.address.country || 'United States',
      });
    }
  }, [user, isAuthenticated, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { street, city, state, zip, country } = shippingAddress;
    if (!street || !city || !state || !zip || !country) {
      showToast('Please fill in all shipping fields', 'warning');
      return false;
    }
    if (paymentMethod === 'Card') {
      const { number, expiry, cvv } = cardInfo;
      if (!number || !expiry || !cvv) {
        showToast('Please fill in card payment details', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price * (1 - item.discount / 100),
        size: item.size,
        color: item.color,
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const result = await api.orders.create(orderData);
      showToast('Order placed successfully!', 'success');
      clearCart();
      
      // Redirect to Order tracking dashboard tab
      navigate(`/dashboard?tab=orders&orderId=${result._id}`);
    } catch (error) {
      showToast(error.message || 'Error processing your checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      <h1 className="font-serif text-4xl tracking-wide border-b border-gray-200 dark:border-luxury-border pb-6 mb-10">
        Checkout
      </h1>

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Address and Billing (8 columns on lg) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Shipping Address form */}
          <div className="space-y-5">
            <h2 className="font-serif text-xl tracking-wide border-b border-gray-100 dark:border-luxury-border/30 pb-2">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  placeholder="123 Luxury Lane"
                  className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Postal / ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={shippingAddress.zip}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment selection */}
          <div className="space-y-5">
            <h2 className="font-serif text-xl tracking-wide border-b border-gray-100 dark:border-luxury-border/30 pb-2">
              Payment Method
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Card', label: 'Credit Card', icon: <CreditCard size={14} /> },
                { id: 'PayPal', label: 'PayPal', icon: <DollarSign size={14} /> },
                { id: 'COD', label: 'Cash On Delivery', icon: <DollarSign size={14} /> },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center gap-2 p-4 border text-[10px] uppercase tracking-widest font-semibold transition-all ${
                    paymentMethod === method.id
                      ? 'border-gold bg-gold/5 text-luxury-charcoal dark:text-white'
                      : 'border-gray-200 dark:border-luxury-border text-gray-400'
                  }`}
                >
                  {method.icon}
                  <span>{method.label}</span>
                </button>
              ))}
            </div>

            {/* Credit Card inputs */}
            {paymentMethod === 'Card' && (
              <div className="bg-beige-100/20 dark:bg-luxury-charcoal/20 p-5 border border-gray-200 dark:border-luxury-border space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardInfo.number}
                    onChange={handleCardChange}
                    placeholder="4000 1234 5678 9010"
                    maxLength="19"
                    className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required={paymentMethod === 'Card'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Expiration Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardInfo.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                      required={paymentMethod === 'Card'}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Security CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardInfo.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full bg-white dark:bg-luxury-black border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                      required={paymentMethod === 'Card'}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'PayPal' && (
              <div className="p-4 border border-blue-100 bg-blue-50/10 text-xs text-blue-500 font-light leading-relaxed">
                Mock integration: Authenticated PayPal redirection will commence upon clicking "Complete Checkout".
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 border border-yellow-100 bg-yellow-50/10 text-xs text-yellow-600 dark:text-yellow-500 font-light leading-relaxed">
                Cash On Delivery is enabled. Settlement of ${totalPrice.toFixed(2)} is due upon courier arrival.
              </div>
            )}
          </div>
        </div>

        {/* Right: Invoice Summary (5 columns on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border shadow-md">
            <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4">
              Invoice Order Details
            </h3>

            {/* Line items mini view */}
            <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
              {cartItems.map((item) => {
                const finalItemPrice = item.price * (1 - item.discount / 100);
                return (
                  <div key={`${item.product}-${item.size}-${item.color}`} className="flex justify-between items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-8 h-10 object-cover flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-light">{item.size} / {item.color} x {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-serif font-semibold">${(finalItemPrice * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Invoicing Totals details */}
            <div className="border-t border-gray-100 dark:border-luxury-border pt-4 space-y-2.5 text-xs text-gray-500 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-luxury-charcoal dark:text-white font-semibold">${itemsPrice.toFixed(2)}</span>
              </div>
              {discountPrice > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Discount</span>
                  <span className="font-semibold">-${discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>VAT / Tax (8%)</span>
                <span className="text-luxury-charcoal dark:text-white font-semibold">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-luxury-charcoal dark:text-white font-semibold">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-luxury-border pt-3 font-serif text-sm font-bold text-luxury-charcoal dark:text-white">
                <span>Total Due</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-center py-4 mt-6 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Transaction...' : 'Complete Checkout'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
            <ShieldCheck size={14} className="text-gold" />
            <span>Secure 256-bit SSL transaction routing</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
