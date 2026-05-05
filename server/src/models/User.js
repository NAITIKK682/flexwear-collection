const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ['Home', 'Office', 'Other'],
    default: 'Home'
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { 
    type: String, 
    required: true, 
    match: [/^\d{6}$/, 'Pincode must be 6 digits']
  },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true
  },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  phone: { type: String, trim: true },
  avatar: String, // Cloudinary URL
  addresses: [addressSchema]
}, { timestamps: true });

// Hash password pre-save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);

