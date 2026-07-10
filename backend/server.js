require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorHandler');

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/tables', require('./src/routes/table.routes'));
app.use('/api/reservations', require('./src/routes/reservation.routes'));
app.use('/api/availability', require('./src/routes/availability.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));