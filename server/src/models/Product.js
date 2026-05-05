const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, min: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ['men', 'women', 'kids', 'accessories'],
    index: true 
  },
  subcategory: String,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: { type: Number, required: true, min: 0, default: 0 },
  featured: { type: Boolean, default: false },
  ratings: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text search index on name and category
productSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);

