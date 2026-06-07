const Product = require('../models/Product');

// @desc    Get all products (with search, filter, sorting, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    // Filters
    const queryFilter = { ...keyword };

    if (req.query.category && req.query.category !== 'All') {
      // Split comma separated categories
      const categories = req.query.category.split(',');
      queryFilter.category = { $in: categories };
    }

    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      queryFilter.brand = { $in: brands };
    }

    // Sort order
    let sort = {};
    if (req.query.sort === 'priceAsc') {
      sort = { price: 1 };
    } else if (req.query.sort === 'priceDesc') {
      sort = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { rating: -1 };
    } else {
      sort = { createdAt: -1 }; // Default new arrivals
    }

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product search suggestions
// @route   GET /api/products/suggestions
// @access  Public
const getProductSuggestions = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' },
    })
      .select('name images price brand category')
      .limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      sizes,
      colors,
      stock,
      discount,
      isFeatured,
      isTrending,
    } = req.body;

    const product = new Product({
      name: name || 'Sample Product',
      price: price || 0,
      user: req.user._id,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600'],
      brand: brand || 'AURA',
      category: category || 'Hoodies',
      sizes: sizes && sizes.length ? sizes : ['S', 'M', 'L'],
      colors: colors && colors.length ? colors : ['Black'],
      stock: stock || 0,
      discount: discount || 0,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      sizes,
      colors,
      stock,
      discount,
      isFeatured,
      isTrending,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.images = images !== undefined ? images : product.images;
      product.brand = brand !== undefined ? brand : product.brand;
      product.category = category !== undefined ? category : product.category;
      product.sizes = sizes !== undefined ? sizes : product.sizes;
      product.colors = colors !== undefined ? colors : product.colors;
      product.stock = stock !== undefined ? stock : product.stock;
      product.discount = discount !== undefined ? discount : product.discount;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductSuggestions,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
