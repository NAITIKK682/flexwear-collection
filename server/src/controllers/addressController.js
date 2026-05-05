const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse'); // Assume sendSuccess exists or use res.status().json

// Get user addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = req.user.addresses || [];
  sendResponse(res, 200, {
    success: true,
    addresses
  });
});

// Add new address
const addAddress = asyncHandler(async (req, res) => {
  const { label, street, city, state, pin, isDefault = false } = req.body;
  
  const newAddress = {
    _id: new mongoose.Types.ObjectId(),
    label,
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    pin,
    isDefault
  };

  if (isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
  }

  req.user.addresses.push(newAddress);
  await req.user.save();

  sendResponse(res, 201, {
    success: true,
    message: 'Address added successfully',
    address: newAddress
  });
});

// Update existing address
const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const addressIndex = req.user.addresses.findIndex(addr => addr._id.toString() === id);

  if (addressIndex === -1) {
    return sendError(res, 404, 'Address not found');
  }

  const address = req.user.addresses[addressIndex];

  // Update fields
  if (updates.label) address.label = updates.label;
  if (updates.street !== undefined) address.street = updates.street.trim();
  if (updates.city !== undefined) address.city = updates.city.trim();
  if (updates.state !== undefined) address.state = updates.state.trim();
  if (updates.pin) address.pin = updates.pin;
  if (updates.isDefault !== undefined) address.isDefault = updates.isDefault;

  // Handle default logic
  if (address.isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
  }

  await req.user.save();

  sendResponse(res, 200, {
    success: true,
    message: 'Address updated successfully',
    address
  });
});

// Delete address
const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const addressIndex = req.user.addresses.findIndex(addr => addr._id.toString() === id);

  if (addressIndex === -1) {
    return sendError(res, 404, 'Address not found');
  }

  const wasDefault = req.user.addresses[addressIndex].isDefault;
  req.user.addresses.splice(addressIndex, 1);

  if (wasDefault && req.user.addresses.length > 0) {
    req.user.addresses[0].isDefault = true;
  }

  await req.user.save();

  sendResponse(res, 200, {
    success: true,
    message: 'Address deleted successfully'
  });
});

// Set default address
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const addressIndex = req.user.addresses.findIndex(addr => addr._id.toString() === id);
  if (addressIndex === -1) {
    return sendError(res, 404, 'Address not found');
  }

  // Set all to false
  req.user.addresses.forEach(addr => addr.isDefault = false);
  // Set target to true
  req.user.addresses[addressIndex].isDefault = true;

  await req.user.save();

  const defaultAddress = req.user.addresses[addressIndex];

  sendResponse(res, 200, {
    success: true,
    message: 'Default address updated',
    defaultAddress
  });
});

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};

