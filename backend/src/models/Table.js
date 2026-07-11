const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Vindela Signature' },
  tableNumber: { type: Number, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, enum: ['family', 'friends', 'bar', 'business', 'brunch', 'birthday', 'sunset'], required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

tableSchema.index({ restaurantName: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);