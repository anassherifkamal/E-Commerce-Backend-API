const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: String, // <-- Changed from ObjectId to String for test sessions
      required: [true, 'A cart must be associated with a user.'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'A product ID is required for each cart item.'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required.'],
          min: [1, 'Quantity must be at least 1.'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required for each cart item.'],
          min: [0, 'Price cannot be negative.'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt for the cart
  }
);

// Pre-save middleware to automatically calculate totalPrice
cartSchema.pre('save', function () {
  // If there are no items, set totalPrice to 0
  if (!this.items || this.items.length === 0) {
    this.totalPrice = 0;
    return;
  }

  // Calculate sum of (price * quantity) for all items in the array
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;