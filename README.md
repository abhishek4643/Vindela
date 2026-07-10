# Vindela - Fine Dining Reservation System

A full-stack Restaurant Reservation Management System built with React, Node.js, Express, and MongoDB. 

This application supports customer-facing table reservations and an administrative command center to oversee bookings, tables, and restaurant capacity.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd vindela
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
Run the database seed script to populate tables and create the default admin user:
```bash
npm run seed
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Default Credentials
- **Admin**: `admin@restaurant.com` / `Admin@123`
- **Customer**: You can register a new account on the login page.

---

## 🤔 Assumptions Made
- **Fixed Time Slots**: Reservations are made in fixed 2-hour blocks (e.g., 11:00-13:00, 13:00-15:00) to simplify capacity management.
- **Single Restaurant**: The system is designed for a single physical restaurant location.
- **Table Capacity**: A party cannot book a table if their guest count exceeds the table's maximum capacity.
- **Cancellation Policy**: Customers can cancel their own reservations, but cannot edit them. Only Admins can manually update reservation statuses.

---

## 📅 Reservation & Availability Logic
The core availability engine ensures that overlapping reservations and capacity conflicts are impossible.

**Logic Flow:**
1. **Capacity Filtering**: When a customer searches for a date and guest count, the backend first filters out tables where `capacity < guestCount`.
2. **Conflict Checking**: For the matching tables, the system queries the `Reservation` collection for any existing `confirmed` or `pending` bookings on that specific date.
3. **Slot Availability**: It maps over the fixed time slots (`VALID_TIME_SLOTS`) and removes any slots that already have a booking for that specific table.
4. **Validation**: During the actual booking `POST` request, a final `isTableAvailable` check is performed to prevent race conditions.

---

## 🔐 Role-Based Access Control (User vs Admin)
The system uses JWT (JSON Web Tokens) for authentication and a robust middleware architecture for authorization.

- **Customer (User)**: 
  - Routes: `/dashboard`, `/reserve`.
  - Can only view their *own* reservations (filtered via `req.user.id`).
  - Can only cancel their *own* reservations.
- **Administrator (Admin)**: 
  - Routes: `/admin`, `/admin/reservations`, `/admin/tables`.
  - Protected on the backend via the `authorize('admin')` middleware.
  - Can view all reservations, update statuses (Confirm/Complete/Cancel), and manage active tables.

---

## ⚠️ Known Limitations
- **No Email Notifications**: The system does not currently send automated confirmation or cancellation emails to users.
- **Time Zones**: Dates and time slots are currently handled as local strings rather than strict UTC ISO dates, which assumes the user and restaurant are in the same time zone.
- **No Table Combining**: Large parties cannot automatically combine two adjacent smaller tables; they must fit within a single table's capacity.

---

## 🔮 Areas for Improvement (With Additional Time)
1. **Interactive Table Map**: Implement a visual 2D floor plan layout where customers can click on their exact physical table.
2. **Automated Reminders**: Integrate SendGrid or Twilio to send SMS/Email reminders 24 hours before a booking.
3. **Payment Integration**: Add Stripe to require a deposit for large parties (preventing no-shows).
4. **Dynamic Time Slots**: Upgrade from fixed 2-hour blocks to a rolling availability algorithm (e.g., booking at 1:15 PM for 90 minutes).