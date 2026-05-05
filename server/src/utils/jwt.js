const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.cookie('token', token, options);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userData
  });
};

module.exports = sendToken;

