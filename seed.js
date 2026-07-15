// 1. Load environment variables first, before anything else runs
require('dotenv').config();

const mongoose = require('mongoose');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model'); // Added Order model
const Cart = require('./models/cart.model');   // Added Cart model

const seedDatabase = async () => {
  try {
    // 2. Connect to the database and wait until established
    const mongoUri = process.env.DATABASE || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('Database connection string is missing in environment variables!');
    }

    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connection established successfully.');

    // 3. Clear out old data in strict order (Carts/Orders -> Products -> Categories)
    console.log('Clearing old data from collections...');
    
    // Clear carts and orders first as they depend on products and users
    await Cart.deleteMany({});
    console.log('Carts collection cleared.');
    
    await Order.deleteMany({});
    console.log('Orders collection cleared.');
    
    await Product.deleteMany({});
    console.log('Products collection cleared.');
    
    await Category.deleteMany({});
    console.log('Categories collection cleared.');
    
    console.log('All old data cleared successfully.');

    // 4. Insert at least 3 different Categories
    console.log('Inserting categories...');
    const categoriesData = [
      { name: 'Electronics', description: 'Gadgets, computers, and tech gear' },
      { name: 'Books', description: 'Literature, novels, and textbooks' },
      { name: 'Clothing', description: 'Apparel, shoes, and fashion' }
    ];

    const createdCategories = await Category.create(categoriesData);
    
    // Map categories by name to easily pull their dynamic _id values
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // 5. Insert at least 6 Products, dynamically matching category _id references
    console.log('Inserting products...');
    const productsData = [
      {
        name: 'HP Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 5000,
        stock: 10,
        category: categoryMap['Electronics'],
        images: ['laptop1.jpg', 'laptop2.jpg']
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic 2.4G optical wireless mouse',
        price: 25,
        stock: 50,
        category: categoryMap['Electronics']
      },
      {
        name: 'Oliver Twist',
        description: 'Classic literature novel by Charles Dickens',
        price: 15,
        stock: 5,
        category: categoryMap['Books']
      },
      {
        name: 'Introduction to Algorithms',
        description: 'Essential textbook on computer science algorithms',
        price: 95,
        stock: 12,
        category: categoryMap['Books']
      },
      {
        name: 'Winter Jacket',
        description: 'Warm windproof outdoor heavy coat',
        price: 120,
        stock: 0, 
        category: categoryMap['Clothing']
      },
      {
        name: 'Classic White T-Shirt',
        description: '100% premium organic cotton t-shirt',
        price: 18,
        stock: 150,
        category: categoryMap['Clothing']
      }
    ];

    const createdProducts = await Product.create(productsData);

    // 6. Print a clear success message
    console.log('\n=========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Cleared: Carts, Orders, Products, Categories`);
    console.log(`Categories added: ${createdCategories.length}`);
    console.log(`Products added:   ${createdProducts.length}`);
    console.log('=========================================\n');

  } catch (error) {
    console.error('Error during seeding database:', error);
  } finally {
    // 7. Disconnect from the database at the very end
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database connection closed safely.');
    process.exit(0);
  }
};

// Execute the script
seedDatabase();