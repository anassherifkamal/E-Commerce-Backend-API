const mongoose = require('mongoose');
const config = require('../config/config'); // Import the config we made above

const connectDB = async () => {
  try {
    if (!config.mongoose.url) {
      throw new Error('Database connection URL (MONGODB_URI) is missing in environment config.');
    }

    const conn = await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Stop the server if database connection fails
  }
};

module.exports = connectDB;