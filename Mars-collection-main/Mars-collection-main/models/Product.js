const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, 'Please select category for this product'],
      enum: ['Men', 'Women', 'Accessories', 'Hoodies', 'T-Shirts', 'Jackets', 'Footwear'],
    },
    brand: {
      type: String,
      required: [true, 'Please enter product brand'],
      default: 'AURA',
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '7', '8', '9', '10', '11'],
        required: true,
      },
    ],
    colors: [
      {
        type: String, // Hex or name (e.g. #000000, Black, Beige)
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number, // Percentage discount, e.g. 10 for 10%
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
