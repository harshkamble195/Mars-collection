const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Check inventory levels first
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (dbProduct.stock < item.qty) {
        return res.status(400).json({ message: `Product ${item.name} is out of stock or has insufficient quantity` });
      }
    }

    // Create the order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : true, // Mock payment: assume Paid if online, unpaid if Cash on Delivery
      paidAt: paymentMethod === 'COD' ? null : Date.now(),
    });

    const createdOrder = await order.save();

    // Deduct stock from products
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Allow the customer who placed it or an admin to access
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Ordered -> Processing -> Shipped -> Out for Delivery -> Delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) order.status = status;
      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid) order.paidAt = Date.now();
      }

      if (status === 'Delivered') {
        order.deliveredAt = Date.now();
        // If COD, mark as paid upon delivery
        if (order.paymentMethod === 'COD') {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const usersCount = await User.countDocuments({ role: 'customer' });
    const products = await Product.find({});
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    // Total sales
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Monthly revenue breakdown (for charts)
    const monthlySales = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize months
    months.forEach((m) => {
      monthlySales[m] = 0;
    });

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthName = months[date.getMonth()];
      monthlySales[monthName] += order.totalPrice;
    });

    const revenueData = Object.keys(monthlySales).map((month) => ({
      name: month,
      revenue: Number(monthlySales[month].toFixed(2)),
    }));

    // Product Category sales breakdown
    const categorySales = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        // Find category from orders or products (we'll fetch category from the item since it doesn't store category directly, let's find the product category)
        const p = products.find((prod) => prod._id.toString() === item.product.toString());
        const category = p ? p.category : 'Unknown';
        categorySales[category] = (categorySales[category] || 0) + item.price * item.qty;
      });
    });

    const categoryData = Object.keys(categorySales).map((cat) => ({
      name: cat,
      value: Number(categorySales[cat].toFixed(2)),
    }));

    // Best-selling products (top 5)
    const productQuantities = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        productQuantities[item.name] = (productQuantities[item.name] || 0) + item.qty;
      });
    });

    const bestSellers = Object.keys(productQuantities)
      .map((name) => ({
        name,
        sales: productQuantities[name],
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    res.json({
      summary: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders: orders.length,
        totalCustomers: usersCount,
        lowStockAlerts: lowStockCount,
      },
      revenueData,
      categoryData,
      bestSellers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getAnalytics,
};
