const sendSuccess = (res, statusCode = 200, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = { sendSuccess, sendError };

