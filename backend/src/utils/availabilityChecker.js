const Reservation = require('../models/Reservation');

const isTableAvailable = async (tableId, date, timeSlot) => {
  const existing = await Reservation.findOne({
    table: tableId, date, timeSlot, status: { $in: ['confirmed', 'pending'] }
  });
  return !existing;
};

const getAvailableTablesForDate = async (date, tables) => {
  const { VALID_TIME_SLOTS } = require('../models/Reservation');
  const reservations = await Reservation.find({ date, status: { $in: ['confirmed', 'pending'] } });
  
  return tables.map(table => {
    const bookedSlots = reservations
      .filter(r => r.table.toString() === table._id.toString())
      .map(r => r.timeSlot);
    
    const availableSlots = VALID_TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
    
    return {
      ...table.toObject(),
      availableSlots,
      isFullyBooked: availableSlots.length === 0
    };
  });
};

module.exports = { isTableAvailable, getAvailableTablesForDate };