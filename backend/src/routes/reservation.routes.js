const express = require('express');
const { getReservations, getMyReservations, createReservation, updateReservationStatus, getReservationStats } = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.get('/my', getMyReservations);
router.post('/', createReservation);

router.get('/stats', authorize('admin'), getReservationStats);
router.get('/', authorize('admin'), getReservations);
router.put('/:id/status', updateReservationStatus);

module.exports = router;