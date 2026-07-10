const express = require('express');
const { getAvailability } = require('../controllers/availabilityController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getAvailability);

module.exports = router;