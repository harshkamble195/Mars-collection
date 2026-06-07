const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/wishlist/:id', protect, removeFromWishlist);

module.exports = router;
