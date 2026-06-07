import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Heart, ShoppingBag, Eye, Lock, CheckCircle, Package, Truck, Compass, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { TableSkeleton } from '../components/LoadingSkeleton';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, wishlist, updateProfile, toggleWishlist, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';
  const orderIdParam = searchParams.get('orderId');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
      setAddressForm({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zip || '',
        country: user.address?.country || 'United States',
      });
    }
  }, [user, isAuthenticated, navigate]);

  // Load orders if "orders" tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
          const data = await api.orders.myOrders();
          setOrders(data);

          // If specific orderId is passed in URL, pre-select it
          if (orderIdParam) {
            const found = data.find((o) => o._id === orderIdParam);
            if (found) setSelectedOrder(found);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [activeTab, orderIdParam, isAuthenticated]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setSelectedOrder(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileForm.password !== profileForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
      };
      if (profileForm.password) updateData.password = profileForm.password;

      await updateProfile(updateData);
      showToast('Profile updated successfully!', 'success');
      setProfileForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      showToast(error.message || 'Error updating profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({
        address: addressForm,
      });
      showToast('Shipping address saved!', 'success');
    } catch (error) {
      showToast(error.message || 'Error saving address', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleMoveToCart = (product) => {
    // Add default options
    const size = product.sizes[0];
    const color = product.colors[0];
    addToCart(product, 1, size, color);
    
    // Remove from wishlist
    toggleWishlist(product);
    showToast(`Moved ${product.name} to bag`, 'success');
  };

  // Rendering the visual order tracking timeline milestones
  const renderTrackingTimeline = (status) => {
    const statuses = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(status);

    const getIcon = (idx, stepStatus) => {
      const isCompleted = idx <= currentIndex;
      
      const colors = isCompleted ? 'bg-gold text-luxury-black border-gold' : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-luxury-border/30 dark:border-luxury-border';
      
      return (
        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 z-10 transition-all font-semibold ${colors}`}>
          {isCompleted ? <Check size={14} /> : idx + 1}
        </div>
      );
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center w-full py-8 relative">
        {/* Horizontal Line background */}
        <div className="absolute top-[34px] left-1/12 right-1/12 h-[2px] bg-gray-200 dark:bg-luxury-border hidden md:block" />
        
        {statuses.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          return (
            <div key={step} className="flex md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto relative mb-4 md:mb-0 last:mb-0">
              {getIcon(idx, step)}
              <div className="text-left md:text-center">
                <span className={`text-[10px] font-bold uppercase tracking-widest block ${isCompleted ? 'text-gold' : 'text-gray-400'}`}>
                  {step}
                </span>
                <span className="text-[9px] text-gray-400 font-light block">
                  {step === 'Ordered' && 'Invoice Verified'}
                  {step === 'Processing' && 'At Logistics Center'}
                  {step === 'Shipped' && 'Transit Dispatched'}
                  {step === 'Out for Delivery' && 'Local Courier Route'}
                  {step === 'Delivered' && 'Receipt Confirmed'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      <h1 className="font-serif text-4xl tracking-wide border-b border-gray-200 dark:border-luxury-border pb-6 mb-10">
        Account Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Tabs Control sidebar */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-luxury-border pb-4 lg:pb-0 lg:pr-6 h-fit shrink-0">
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <User size={14} /> Profile & Address
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <ShoppingBag size={14} /> Order History
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'wishlist'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <Heart size={14} /> My Wishlist
          </button>
        </div>

        {/* Tab Contents panel (Right side) */}
        <div className="lg:col-span-3">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Profile details editing */}
              <form onSubmit={handleProfileSubmit} className="space-y-6 bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border">
                <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4 flex items-center gap-2">
                  <Lock size={12} className="text-gold" /> Login Profile
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">New Password (Optional)</label>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Confirm Password</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <button type="submit" disabled={profileLoading} className="btn-gold w-full text-center">
                  Update Profile Details
                </button>
              </form>

              {/* Saved Address details editing */}
              <form onSubmit={handleAddressSubmit} className="space-y-6 bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border">
                <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4 flex items-center gap-2">
                  <MapPin size={12} className="text-gold" /> Saved Shipping Address
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="Enter street name"
                    className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      placeholder="ZIP"
                      className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Country</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      placeholder="Country"
                      className="w-full bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" disabled={profileLoading} className="btn-gold w-full text-center">
                  Save Address Coordinates
                </button>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {selectedOrder ? (
                /* Order detailed visual tracking screen */
                <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border shadow-md space-y-8 animate-fade-in">
                  <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-luxury-border pb-4">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-luxury-charcoal dark:hover:text-white transition-colors"
                    >
                      &larr; Back to List
                    </button>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400">Order ID</span>
                      <p className="text-xs font-mono font-bold text-luxury-charcoal dark:text-white mt-0.5">{selectedOrder._id}</p>
                    </div>
                  </div>

                  {/* VISUAL TRACKING TIMELINE */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 text-center">Delivery Tracking</h3>
                    {renderTrackingTimeline(selectedOrder.status)}
                  </div>

                  <hr className="border-gray-200 dark:border-luxury-border" />

                  {/* Order Invoice Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light">
                    {/* Shipping Address review */}
                    <div>
                      <h4 className="uppercase font-semibold tracking-wider text-gray-400 mb-2">Shipping Information</h4>
                      <p className="font-medium">{user.name}</p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">
                        {selectedOrder.shippingAddress.street} <br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip} <br />
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>

                    {/* Cost Breakdown */}
                    <div>
                      <h4 className="uppercase font-semibold tracking-wider text-gray-400 mb-2">Invoiced Total Cost</h4>
                      <div className="space-y-2 text-gray-500 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Items Price</span>
                          <span className="font-semibold text-luxury-charcoal dark:text-white">${selectedOrder.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sales VAT Tax</span>
                          <span className="font-semibold text-luxury-charcoal dark:text-white">${selectedOrder.taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping Insured</span>
                          <span className="font-semibold text-luxury-charcoal dark:text-white">${selectedOrder.shippingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 dark:border-luxury-border pt-2 text-sm font-bold text-luxury-charcoal dark:text-white">
                          <span>Total Amount</span>
                          <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List of items ordered */}
                  <div className="border-t border-gray-100 dark:border-luxury-border pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-4">Ordered Garments</h4>
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={`${item.product}-${item.size}-${item.color}`} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-12 object-cover" />
                            <div className="text-left">
                              <p className="font-bold">{item.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size} / Color: {item.color} x{item.qty}</p>
                            </div>
                          </div>
                          <span className="font-serif font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Orders list table */
                <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border">
                  <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-6">
                    Purchasing Log
                  </h3>

                  {loadingOrders ? (
                    <TableSkeleton cols={4} rows={4} />
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">No order logs found.</p>
                      <Link to="/shop" className="btn-outline inline-block mt-4">
                        Purchase First Item
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-luxury-border text-gray-400 uppercase tracking-widest font-semibold">
                            <th className="py-3 px-2">Order ID</th>
                            <th className="py-3 px-2">Date</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Total Amount</th>
                            <th className="py-3 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-luxury-border/50">
                          {orders.map((ord) => (
                            <tr key={ord._id} className="hover:bg-beige-100/10 dark:hover:bg-luxury-black/10">
                              <td className="py-3 px-2 font-mono truncate max-w-28">{ord._id}</td>
                              <td className="py-3 px-2 text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-2">
                                <span className={`inline-block text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 ${
                                  ord.status === 'Delivered' ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400' :
                                  ord.status === 'Shipped' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' :
                                  'bg-gold/10 text-gold'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 font-semibold">${ord.totalPrice.toFixed(2)}</td>
                              <td className="py-3 px-2 text-right">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="text-[10px] uppercase tracking-widest font-bold hover:text-gold flex items-center gap-1.5 ml-auto text-gray-500"
                                >
                                  <Eye size={12} /> View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border">
              <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-6">
                Saved Items Grid
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Your wishlist is empty.</p>
                  <Link to="/shop" className="btn-outline inline-block mt-4">
                    Explore Catalog
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item._id} className="flex flex-col border border-gray-100 dark:border-luxury-border/50 p-2 text-left relative group">
                      <div className="aspect-[3/4] bg-gray-50 dark:bg-luxury-black overflow-hidden relative">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-2 right-2 p-1.5 bg-white/95 dark:bg-luxury-charcoal/95 rounded-full shadow text-red-500 hover:scale-105 transition-transform"
                        >
                          <CheckCircle size={14} className="fill-current" />
                        </button>
                      </div>

                      <h4 className="text-xs font-semibold mt-3 truncate">{item.name}</h4>
                      <p className="text-xs font-serif font-bold mt-1 text-gold">${item.price.toFixed(2)}</p>

                      <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-gray-50 dark:border-luxury-border/50">
                        <Link to={`/product/${item._id}`} className="text-[9px] text-center border border-gray-300 dark:border-luxury-border py-1.5 uppercase font-semibold hover:border-luxury-charcoal dark:hover:border-white">
                          Details
                        </Link>
                        {item.stock > 0 ? (
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="text-[9px] text-center bg-luxury-black dark:bg-white text-white dark:text-luxury-black py-1.5 uppercase font-semibold hover:bg-gold dark:hover:bg-gold dark:hover:text-luxury-black"
                          >
                            Add to Bag
                          </button>
                        ) : (
                          <button disabled className="text-[9px] text-center bg-gray-300 text-gray-500 py-1.5 uppercase font-semibold cursor-not-allowed">
                            Out of Stock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
