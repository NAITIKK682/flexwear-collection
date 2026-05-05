const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const sendToken = require('../utils/jwt');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
// Removed unused import - validators used in routes

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  console.log('📥 Register request received:', req.body.email);
  
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('❌ User already exists:', email);
    return sendError(res, 400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });
  
  console.log('✅ User created:', user._id);

  sendToken(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, 401, 'Invalid email or password');
  }

  sendToken(user, 200, res, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', 'loggedout', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: new Date(0)
  });

  sendSuccess(res, 200, 'Logged out successfully');
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }
  sendSuccess(res, 200, 'User profile fetched', user);
});

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    phone: req.body.phone,
    ...(req.body.avatar && { avatar: req.body.avatar })
  };

  const phoneRegex = /^[0-9]{10}$/;
  if (req.body.phone && !phoneRegex.test(req.body.phone)) {
    return sendError(res, 400, 'Invalid phone number');
  }

  const user = await User.findByIdAndUpdate(
    req.user.id, 
    updates, 
    { new: true, runValidators: true }
  ).select('-password');

  sendSuccess(res, 200, 'Profile updated', user);
});

// @desc    Change password
// @route   PUT /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (newPassword.length < 6) {
    return sendError(res, 400, 'New password must be min 6 chars');
  }

  const user = await User.findById(req.user.id).select('+password');
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 400, 'Current password incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, 200, 'Password changed successfully');
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword
};

