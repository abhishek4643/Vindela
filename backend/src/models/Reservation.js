const mongoose = require('mongoose');

const VALID_TIME_SLOTS = [
  '11:00-13:00', '13:00-15:00', '15:00-17:00',
  '17:00-19:00', '19:00-21:00', '21:00-23:00'
];

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  restaurantName: { type: String, required: true, default: 'Vindela Signature' },
  date: { type: String, required: true },
  timeSlot: { type: String, enum: VALID_TIME_SLOTS, required: true },
  partySize: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  specialRequests: { type: String },
  confirmationCode: { type: String, unique: true }
}, { timestamps: true });

reservationSchema.pre('save', function() {
  if (!this.confirmationCode) {
    this.confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
module.exports.VALID_TIME_SLOTS = VALID_TIME_SLOTS;