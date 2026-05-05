const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} = require('../controllers/addressController');
const { 
  validateAddAddress, 
  validateUpdateAddress, 
  validateDeleteAddress, 
  validateSetDefaultAddress 
} = require('../validators/addressValidator');

// GET /api/addresses - Get user addresses
router.get('/', protect, getAddresses);

// POST /api/addresses - Add new address
router.post('/', protect, validateAddAddress, addAddress);

// PUT /api/addresses/:id - Update address
router.put('/:id', protect, validateUpdateAddress, updateAddress);

// DELETE /api/addresses/:id - Delete address
router.delete('/:id', protect, validateDeleteAddress, deleteAddress);

// PATCH /api/addresses/default/:id - Set default address
router.patch('/default/:id', protect, validateSetDefaultAddress, setDefaultAddress);

module.exports = router;

