const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category name is required.'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save middleware to automatically generate the slug from the name
categorySchema.pre('save', function () {
  // Only generate/update the slug if the name field is modified
  if (!this.isModified('name')) return;

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-');        // Replace spaces with hyphens
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;