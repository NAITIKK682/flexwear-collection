const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { 
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
