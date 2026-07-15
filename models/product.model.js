const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product name is required.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A product description is required.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A product price is required.'],
      min: [0, 'Price cannot be less than 0.'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required.'],
      min: [0, 'Stock cannot be less than 0.'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'A product must belong to a category.'],
    },
    images: {
      type: [String],
      default: [], // Returns an empty array if no images are provided
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save middleware to automatically calculate 'inStock' based on 'stock'
productSchema.pre('save', function () {
  // Only recalculate if the stock field has been modified
  if (!this.isModified('stock')) return;

  this.inStock = this.stock > 0;
});

// Pre-update middleware to handle findOneAndUpdate and update queries
productSchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const update = this.getUpdate();
  
  // If stock is being updated, recalculate inStock
  if (update && typeof update.stock !== 'undefined') {
    update.inStock = update.stock > 0;
  }
});

// Pre-update middleware to handle findOneAndUpdate and update queries
productSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
  const update = this.getUpdate();
  
  // If stock is being updated, recalculate inStock
  if (update && typeof update.stock !== 'undefined') {
    update.inStock = update.stock > 0;
  }
  
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;