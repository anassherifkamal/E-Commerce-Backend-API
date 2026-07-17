const dotenv = require('dotenv');
const path = require('path');

// This forces Node to look in the absolute root directory of your project for .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoose: {
    url: process.env.MONGO_URI,
    options: {} 
  }
};