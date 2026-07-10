const express = require('express');
const { getTables, getTable, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getTables).post(createTable);
router.route('/:id').get(getTable).put(updateTable).delete(deleteTable);

module.exports = router;