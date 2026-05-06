const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  // ✅ FIX: Frontend 'productId' bhej raha hai, par yahan field name 'product' hai.
  // Is mismatch ko handle karne ke liye hum controller mein dhyan denge, 
  // lekin model mein consistency ke liye hum ise 'product' hi rakhenge.
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: [true, 'Product ID is required'] 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, 'Quantity cannot be less than 1'], 
    default: 1 
  },
  size: {
    type: String,
    required: [true, 'Size is required'] // Agar size mandatory hai toh validation error dega
  },
  color: {
    type: String,
    default: 'Default'
  }
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  items: [cartItemSchema],
  totalItems: { 
    type: Number, 
    default: 0 
  },
  totalPrice: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Standard timestamps (createdAt, updatedAt)
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', async function(next) {
  // Agar items modified nahi hain toh calculation skip karein (Performance Optimization)
  if (!this.isModified('items')) return next();

  let totalItems = 0;
  let totalPrice = 0;
  
  try {
    for (let item of this.items) {
      totalItems += item.quantity;
      
      // Har item ke liye Product price fetch karna
      const product = await mongoose.model('Product').findById(item.product).select('price discountedPrice').lean();
      
      if (product) {
        const price = product.discountedPrice || product.price || 0;
        totalPrice += price * item.quantity;
      }
    }
    
    this.totalItems = totalItems;
    this.totalPrice = totalPrice;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Cart', cartSchema);