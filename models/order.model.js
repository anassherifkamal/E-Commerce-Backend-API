const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required.'],
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required for order items.'],
        },
        name: {
          type: String,
          required: [true, 'Product name is required at checkout.'],
        },
        price: {
          type: Number,
          required: [true, 'Product price is required at checkout.'],
          min: [0, 'Price cannot be negative.'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required.'],
          min: [1, 'Quantity must be at least 1.'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
      min: [0, 'Total price cannot be negative.'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        message: 'Status must be pending, confirmed, shipped, delivered, or cancelled.',
      },
      default: 'pending',
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required.'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required.'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required.'],
        trim: true,
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-validate hook to automatically generate a unique orderNumber before validation runs
orderSchema.pre('validate', function () {
  if (!this.orderNumber) {
    // Generates a unique string order number (e.g., ORD-1692038472-A3F9)
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${randomSuffix}`;
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;