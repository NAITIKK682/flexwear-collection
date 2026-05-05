const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect, requireRole } = require('../middleware/auth');

// 1. Get all products with advanced filtering
const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build filter
  let filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.subcategory) filter.subcategory = req.query.subcategory;
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = req.query.minPrice;
    if (req.query.maxPrice) filter.price.$lte = req.query.maxPrice;
  }
  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }

  // Sorting
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const sort = { [sortBy]: order };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-__v');

  sendSuccess(res, 200, 'Products fetched', {
    products,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// 2. Get single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name avatar' }
  });

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  sendSuccess(res, 200, 'Product fetched', product);
});

// 3. Create product [ADMIN]
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  sendSuccess(res, 201, 'Product created', product);
});

// 4. Update product [ADMIN]
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  sendSuccess(res, 200, 'Product updated', product);
});

// 5. Delete product [ADMIN]
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  sendSuccess(res, 200, 'Product deleted successfully');
});

// 6. Add review
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // Check if already reviewed
  const alreadyReviewed = await Review.findOne({
    user: req.user.id,
    product: req.params.id
  });

  if (alreadyReviewed) {
    return sendError(res, 400, 'Already reviewed this product');
  }

  const review = await Review.create({
    user: req.user.id,
    product: req.params.id,
    rating,
    comment
  });

  // Update product ratings
  const reviews = await Review.find({ product: req.params.id });
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalRating / reviews.length;
  
  await Product.findByIdAndUpdate(req.params.id, {
    ratings: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });

  sendSuccess(res, 201, 'Review added', review);
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};

