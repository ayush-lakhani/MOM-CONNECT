const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    image: {
      type: String, // Main thumbnail
    },
    category: {
      type: String,
      default: 'General',
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isSold: 1 });

module.exports = mongoose.model('Product', productSchema);
