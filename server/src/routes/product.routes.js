const express = require('express');
const router = express.Router();
const { 
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const { protect, requireRole } = require('../middleware/auth');
const { productCreateValidator, productIdValidator, reviewValidator } = require('../validators/productValidator');

router.get('/', getAllProducts);
router.get('/:id', productIdValidator, getProductById);
router.post('/', protect, requireRole('admin'), productCreateValidator, createProduct);
router.put('/:id', protect, requireRole('admin'), productIdValidator, productCreateValidator, updateProduct);
router.delete('/:id', protect, requireRole('admin'), productIdValidator, deleteProduct);
router.post('/:id/review', protect, productIdValidator, reviewValidator, addReview);

module.exports = router;
