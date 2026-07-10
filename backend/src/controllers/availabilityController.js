const Table = require('../models/Table');
const { asyncHandler } = require('../middleware/errorHandler');
const { getAvailableTablesForDate } = require('../utils/availabilityChecker');

const getAvailability = asyncHandler(async (req, res) => {
  const { date, guests } = req.query;
  if (!date) { res.status(400); throw new Error('Date is required'); }
  
  const guestCount = guests ? parseInt(guests) : 1;
  const tables = await Table.find({ isActive: true, capacity: { $gte: guestCount } });
  
  const availableTables = await getAvailableTablesForDate(date, tables);
  res.json({ success: true, date, tables: availableTables });
});

module.exports = { getAvailability };