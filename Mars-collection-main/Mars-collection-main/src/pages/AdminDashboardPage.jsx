import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, ShoppingBag, FolderOpen, AlertTriangle, X, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/LoadingSkeleton';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('analytics');

  // Analytics states
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Products states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Hoodies',
    brand: 'AURA',
    images: '',
    sizes: [],
    colors: [],
    stock: 0,
    discount: 0,
    isFeatured: false,
    isTrending: false,
  });

  const categoryOptions = ['Men', 'Women', 'Accessories', 'Hoodies', 'T-Shirts', 'Jackets', 'Footwear'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '7', '8', '9', '10', '11'];
  const COLORS = ['#D4AF37', '#C5A880', '#0A0A0A', '#EAEAE0', '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      showToast('Admin privilege is required to access this portal.', 'error');
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Load analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await api.orders.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      showToast('Error loading shop analytics', 'error');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Load products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.products.list({ limit: 100 });
      setProducts(data.products || []);
    } catch (error) {
      showToast('Error loading product catalog', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.orders.listAll();
      setOrders(data);
    } catch (error) {
      showToast('Error loading system orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(productId);
      showToast('Product successfully removed', 'success');
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Error deleting product', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 100,
      category: 'Hoodies',
      brand: 'AURA',
      images: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      sizes: ['S', 'M', 'L'],
      colors: ['#EAEAE0', '#0A0A0A'],
      stock: 15,
      discount: 0,
      isFeatured: false,
      isTrending: false,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand,
      images: p.images.join(', '),
      sizes: p.sizes,
      colors: p.colors,
      stock: p.stock,
      discount: p.discount,
      isFeatured: p.isFeatured || false,
      isTrending: p.isTrending || false,
    });
    setProductModalOpen(true);
  };

  const handleSizeToggle = (size) => {
    const isSelected = productForm.sizes.includes(size);
    const updatedSizes = isSelected
      ? productForm.sizes.filter((s) => s !== size)
      : [...productForm.sizes, size];
    setProductForm({ ...productForm, sizes: updatedSizes });
  };

  const handleColorToggle = (color) => {
    const isSelected = productForm.colors.includes(color);
    const updatedColors = isSelected
      ? productForm.colors.filter((c) => c !== color)
      : [...productForm.colors, color];
    setProductForm({ ...productForm, colors: updatedColors });
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      discount: Number(productForm.discount),
      images: productForm.images.split(',').map((url) => url.trim()).filter((url) => url !== ''),
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct._id, formattedData);
        showToast('Product updated successfully', 'success');
      } else {
        await api.products.create(formattedData);
        showToast('Product created successfully', 'success');
      }
      setProductModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Error saving product', 'error');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (error) {
      showToast(error.message || 'Error updating order status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 text-left">
      <div className="border-b border-gray-200 dark:border-luxury-border pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-wide">Administration Panel</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-light">
            Store operations, logistics dispatch, and financial analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Navigation Sidebar */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-luxury-border pb-4 lg:pb-0 lg:pr-6 h-fit shrink-0 lg:col-span-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} /> Shop Analytics
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <FolderOpen size={14} /> Catalog Manager
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest font-semibold w-full whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-black'
                : 'text-gray-400 hover:text-luxury-charcoal dark:hover:text-white'
            }`}
          >
            <ShoppingBag size={14} /> Order Logs
          </button>
        </div>

        {/* Contents Grid Panel */}
        <div className="lg:col-span-4">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-10">
              {loadingAnalytics ? (
                <div className="text-center py-20 text-xs tracking-wider text-gray-400">Loading Business Intelligence...</div>
              ) : analytics ? (
                <>
                  {/* Summary Metric widgets */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-gray-200 dark:border-luxury-border p-5 bg-white dark:bg-luxury-charcoal">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Gross Sales</span>
                      <span className="font-serif text-2xl font-semibold mt-1 block">${analytics.summary.totalSales.toFixed(2)}</span>
                    </div>
                    <div className="border border-gray-200 dark:border-luxury-border p-5 bg-white dark:bg-luxury-charcoal">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Total Invoices</span>
                      <span className="font-serif text-2xl font-semibold mt-1 block">{analytics.summary.totalOrders}</span>
                    </div>
                    <div className="border border-gray-200 dark:border-luxury-border p-5 bg-white dark:bg-luxury-charcoal">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Audited Clientele</span>
                      <span className="font-serif text-2xl font-semibold mt-1 block">{analytics.summary.totalCustomers}</span>
                    </div>
                    <div className="border border-gray-200 dark:border-luxury-border p-5 bg-white dark:bg-luxury-charcoal flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Inventory Warnings</span>
                        <span className={`font-serif text-2xl font-semibold mt-1 block ${analytics.summary.lowStockAlerts > 0 ? 'text-red-500' : ''}`}>
                          {analytics.summary.lowStockAlerts}
                        </span>
                      </div>
                      {analytics.summary.lowStockAlerts > 0 && <AlertTriangle size={18} className="text-red-500" />}
                    </div>
                  </div>

                  {/* Revenue Line Chart */}
                  <div className="border border-gray-200 dark:border-luxury-border p-6 bg-white dark:bg-luxury-charcoal">
                    <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-6">Monthly Revenue Dynamics</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                          <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                          <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Split Row: Categories Breakdown & Top Sellers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Pie Chart */}
                    <div className="border border-gray-200 dark:border-luxury-border p-6 bg-white dark:bg-luxury-charcoal flex flex-col justify-between">
                      <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4">Category Allocations</h3>
                      <div className="h-60 flex justify-center items-center">
                        {analytics.categoryData.length === 0 ? (
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">No Sales Data</p>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {analytics.categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Best Sellers */}
                    <div className="border border-gray-200 dark:border-luxury-border p-6 bg-white dark:bg-luxury-charcoal">
                      <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3 mb-4 flex items-center gap-1.5"><Award size={14} className="text-gold" /> Velocity Top Performers</h3>
                      <div className="h-60 flex flex-col justify-center">
                        {analytics.bestSellers.length === 0 ? (
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">No Orders Logged</p>
                        ) : (
                          <div className="space-y-4 text-xs font-light">
                            {analytics.bestSellers.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-luxury-border/30 pb-2 last:border-b-0">
                                <span className="font-semibold text-luxury-charcoal dark:text-white truncate max-w-xs">{idx + 1}. {item.name}</span>
                                <span className="bg-gold/10 text-gold px-2.5 py-0.5 font-bold uppercase tracking-widest text-[9px]">{item.sales} Units Sold</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-luxury-border pb-4">
                <h3 className="text-xs uppercase tracking-widest font-semibold">Inventory Catalogue</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="btn-gold py-2.5 px-4 flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              {loadingProducts ? (
                <TableSkeleton rows={6} cols={5} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-luxury-border text-gray-400 uppercase tracking-widest font-semibold">
                        <th className="py-3 px-2">Image</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Category</th>
                        <th className="py-3 px-2">Price</th>
                        <th className="py-3 px-2">Stock</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-luxury-border/50">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-beige-100/10 dark:hover:bg-luxury-black/10">
                          <td className="py-3 px-2">
                            <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover border border-black/10" />
                          </td>
                          <td className="py-3 px-2 font-semibold max-w-xs truncate">{p.name}</td>
                          <td className="py-3 px-2 text-gray-500">{p.category}</td>
                          <td className="py-3 px-2 font-semibold">${p.price.toFixed(2)}</td>
                          <td className={`py-3 px-2 font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                            {p.stock}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="text-gray-400 hover:text-gold transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleProductDelete(p._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-luxury-charcoal p-6 border border-gray-200 dark:border-luxury-border space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold border-b border-gray-100 dark:border-luxury-border pb-3">Order Manager</h3>
              
              {loadingOrders ? (
                <TableSkeleton rows={5} cols={5} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-luxury-border text-gray-400 uppercase tracking-widest font-semibold">
                        <th className="py-3 px-2">Order ID</th>
                        <th className="py-3 px-2">Client</th>
                        <th className="py-3 px-2">Total Price</th>
                        <th className="py-3 px-2">Shipment Status</th>
                        <th className="py-3 px-2 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-luxury-border/50">
                      {orders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-beige-100/10 dark:hover:bg-luxury-black/10">
                          <td className="py-3 px-2 font-mono truncate max-w-28">{ord._id}</td>
                          <td className="py-3 px-2 font-semibold text-gray-500">{ord.user?.name || 'Guest'}</td>
                          <td className="py-3 px-2 font-semibold">${ord.totalPrice.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-block text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 ${
                              ord.status === 'Delivered' ? 'bg-green-100 text-green-600 dark:bg-green-950/30' :
                              ord.status === 'Shipped' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/30' :
                              'bg-gold/10 text-gold'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                              className="bg-transparent border border-gray-200 dark:border-luxury-border px-2 py-1 text-xs focus:outline-none focus:border-gold dark:bg-luxury-black text-luxury-charcoal dark:text-white"
                            >
                              <option value="Ordered">Ordered</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
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
      </div>

      {/* CRUD Product Dialog Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-luxury-charcoal border border-gray-200 dark:border-luxury-border shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto text-left relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-luxury-charcoal dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="font-serif text-2xl tracking-wide border-b border-gray-100 dark:border-luxury-border pb-3 mb-6">
              {editingProduct ? `Edit product specifications` : 'Create New Collection Item'}
            </h2>

            <form onSubmit={handleProductFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Brand Label</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Item Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Category Line</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white dark:bg-luxury-black"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Price ($)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    min="1"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    min="0"
                    max="99"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Inventory Stock Levels</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="bg-transparent border border-gray-200 dark:border-luxury-border px-3 py-2 focus:border-gold focus:outline-none text-luxury-charcoal dark:text-white"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Sizes checkboxes selector */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Sizes Available</label>
                <div className="flex flex-wrap gap-2 border border-gray-100 dark:border-luxury-border p-2 bg-beige-100/10 dark:bg-luxury-black/10">
                  {sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3 py-1.5 border tracking-wider font-semibold transition-all ${
                        productForm.sizes.includes(sz)
                          ? 'border-gold bg-gold/5 text-gold font-bold'
                          : 'border-gray-200 dark:border-luxury-border hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors selection */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Design Colors (select tags)</label>
                <div className="flex flex-wrap gap-3 border border-gray-100 dark:border-luxury-border p-3 bg-beige-100/10 dark:bg-luxury-black/10">
                  {['#EAEAE0', '#C5A880', '#0A0A0A', '#FFFFFF', '#D4AF37', 'Red', 'Blue', 'Charcoal'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleColorToggle(col)}
                      className={`px-3 py-1 border transition-all ${
                        productForm.colors.includes(col)
                          ? 'border-luxury-charcoal dark:border-white bg-luxury-charcoal text-white dark:bg-white dark:text-luxury-black font-bold'
                          : 'border-gray-200 dark:border-luxury-border hover:border-gray-400'
                      }`}
                    >
                      {col.startsWith('#') ? (
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 inline-block border border-black/10" style={{ backgroundColor: col }} />
                          <span>{col}</span>
                        </div>
                      ) : (
                        col
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges flags */}
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase tracking-wider text-gray-400">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-gold cursor-pointer"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase tracking-wider text-gray-400">
                  <input
                    type="checkbox"
                    checked={productForm.isTrending}
                    onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                    className="accent-gold cursor-pointer"
                  />
                  <span>Trending Page</span>
                </label>
              </div>

              <button type="submit" className="btn-gold w-full text-center py-3.5 mt-4">
                {editingProduct ? 'Save Product Details' : 'Create Catalogue Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
