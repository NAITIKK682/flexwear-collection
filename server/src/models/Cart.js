const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  size: String,
  color: String
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalItems: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: { updatedAt: 'updatedAt' } });

// Pre-save middleware to calculate totals
cartSchema.pre('save', async function(next) {
  let totalItems = 0;
  let totalPrice = 0;
  
  for (let item of this.items) {
    totalItems += item.quantity;
    // Note: For accurate price, populate would be needed in controller
    // Here using discountedPrice fallback to price
    const product = await mongoose.model('Product').findById(item.product).lean();
    const price = product?.discountedPrice || product?.price || 0;
    totalPrice += price * item.quantity;
  }
  
  this.totalItems = totalItems;
  this.totalPrice = totalPrice;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);

