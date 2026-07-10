const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const { asyncHandler } = require('../middleware/errorHandler');
const { isTableAvailable } = require('../utils/availabilityChecker');

const getReservations = asyncHandler(async (req, res) => {
  const { date, status } = req.query;
  const filter = {};
  if (date) filter.date = date;
  if (status) filter.status = status;
  
  const reservations = await Reservation.find(filter)
    .populate('user', 'name email phone')
    .populate('table', 'tableNumber location')
    .sort({ date: 1, timeSlot: 1 });
    
  res.json({ success: true, count: reservations.length, reservations });
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id })
    .populate('table', 'tableNumber location')
    .sort({ date: 1, timeSlot: 1 });
  res.json({ success: true, data: reservations });
});

const createReservation = asyncHandler(async (req, res) => {
  const { tableId, date, timeSlot, partySize, specialRequests, restaurantName } = req.body;
  const table = await Table.findById(tableId);
  if (!table || !table.isActive) { res.status(400); throw new Error('Table not available'); }
  if (partySize > table.capacity) { res.status(400); throw new Error('Party size exceeds table capacity'); }
  
  const available = await isTableAvailable(tableId, date, timeSlot);
  if (!available) { res.status(400); throw new Error('Table is already booked for this time slot'); }
  
  const reservation = await Reservation.create({
    user: req.user.id, table: tableId, date, timeSlot, partySize, specialRequests,
    restaurantName: restaurantName || 'Vindela Signature'
  });
  
  const populated = await Reservation.findById(reservation._id).populate('table');
  res.status(201).json({ success: true, reservation: populated });
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) { res.status(404); throw new Error('Reservation not found'); }
  
  // if customer is cancelling their own
  if (req.user.role === 'customer') {
    if (reservation.user.toString() !== req.user.id.toString()) {
      res.status(403); throw new Error('Not authorized');
    }
    if (status !== 'cancelled') {
      res.status(400); throw new Error('Customers can only cancel reservations');
    }
  }

  reservation.status = status;
  await reservation.save();
  res.json({ success: true, reservation });
});

const getReservationStats = asyncHandler(async (req, res) => {
  const total = await Reservation.countDocuments();
  const confirmed = await Reservation.countDocuments({ status: 'confirmed' });
  const cancelled = await Reservation.countDocuments({ status: 'cancelled' });
  const today = new Date().toISOString().split('T')[0];
  const todayCount = await Reservation.countDocuments({ date: today });
  
  res.json({ success: true, stats: { total, confirmed, cancelled, todayCount } });
});

module.exports = { getReservations, getMyReservations, createReservation, updateReservationStatus, getReservationStats };