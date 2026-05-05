require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('./src/config/database');
const cloudinary = require('./src/config/cloudinary');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Closing server...`);
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

