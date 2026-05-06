const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const mongoose = require('mongoose'); // ✅ FIX 1: Mongoose import zaroori hai
const { sendResponse } = require('../utils/apiResponse'); 

// Note: Agar aapka apiResponse file 'sendError' bhi deta hai, toh use yahan add karein
// varna main niche standard res.status ka use kar raha hoon safety ke liye.

// Get user addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = req.user.addresses || [];
  // ✅ Frontend handles .data.addresses, so sending as data
  res.status(200).json({
    success: true,
    data: addresses 
  });
});

// Add new address
const addAddress = asyncHandler(async (req, res) => {
  const { label, street, city, state, pin, isDefault = false } = req.body;
  
  if (!street || !city || !pin) {
     return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const newAddress = {
    _id: new mongoose.Types.ObjectId(),
    label: label || 'Home',
    street: street.trim(),
    city: city.trim(),
    state: state?.trim() || '',
    pin,
    isDefault
  };

  if (isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
  }

  req.user.addresses.push(newAddress);
  await req.user.save();

  res.status(201).json({
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
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  const address = req.user.addresses[addressIndex];

  // Update fields safely
  if (updates.label) address.label = updates.label;
  if (updates.street !== undefined) address.street = updates.street.trim();
  if (updates.city !== undefined) address.city = updates.city.trim();
  if (updates.state !== undefined) address.state = updates.state.trim();
  if (updates.pin) address.pin = updates.pin;
  if (updates.isDefault !== undefined) address.isDefault = updates.isDefault;

  if (address.isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
  }

  await req.user.save();

  res.status(200).json({
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
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  const wasDefault = req.user.addresses[addressIndex].isDefault;
  req.user.addresses.splice(addressIndex, 1);

  if (wasDefault && req.user.addresses.length > 0) {
    req.user.addresses[0].isDefault = true;
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// Set default address
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const addressIndex = req.user.addresses.findIndex(addr => addr._id.toString() === id);
  if (addressIndex === -1) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  req.user.addresses.forEach(addr => addr.isDefault = false);
  req.user.addresses[addressIndex].isDefault = true;

  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Default address updated',
    defaultAddress: req.user.addresses[addressIndex]
  });
});

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};