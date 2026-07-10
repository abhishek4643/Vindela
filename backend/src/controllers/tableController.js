const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const { asyncHandler } = require('../middleware/errorHandler');

const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ tableNumber: 1 });
  res.json({ success: true, count: tables.length, tables });
});

const getTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) { res.status(404); throw new Error('Table not found'); }
  res.json({ success: true, table });
});

const createTable = asyncHandler(async (req, res) => {
  const table = await Table.create(req.body);
  res.status(201).json({ success: true, table });
});

const updateTable = asyncHandler(async (req, res) => {
  let table = await Table.findById(req.params.id);
  if (!table) { res.status(404); throw new Error('Table not found'); }
  
  if (req.body.isActive === false) {
    const upcomingRes = await Reservation.findOne({
      table: req.params.id,
      status: { $in: ['confirmed', 'pending'] },
      date: { $gte: new Date().toISOString().split('T')[0] }
    });
    if (upcomingRes) {
      res.status(400);
      throw new Error('Cannot deactivate table with upcoming reservations');
    }
  }

  table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, table });
});

const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) { res.status(404); throw new Error('Table not found'); }
  
  const hasRes = await Reservation.findOne({ table: req.params.id });
  if (hasRes) {
    res.status(400);
    throw new Error('Cannot delete table that has reservation history. Set to inactive instead.');
  }

  await table.deleteOne();
  res.json({ success: true, data: {} });
});

module.exports = { getTables, getTable, createTable, updateTable, deleteTable };