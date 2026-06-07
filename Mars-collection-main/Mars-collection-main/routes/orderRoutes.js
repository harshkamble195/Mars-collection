const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getAnalytics,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/analytics').get(protect, admin, getAnalytics);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
