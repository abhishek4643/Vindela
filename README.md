# Vindela

A full-stack culinary commerce and order management platform dedicated to pure vegetarian cuisine, featuring real-time catalog navigation, resilient cart synchronization, and an administrative order orchestration pipeline.

[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tooling](https://img.shields.io/badge/Build-Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Project Overview

Vindela bridges the gap between discerning vegetarian consumers and verified vegetarian culinary kitchens. Built with a decoupled MERN architecture (React 19, Vite 8, Express 5, and MongoDB Mongoose 9), the system provides transparent ingredient sourcing, dietary tags (vegan, Jain, gluten-free), and real-time order lifecycle tracking.

**Vision:** Provide an uncompromising, delightful dining platform that guarantees 100% vegetarian integrity with modern digital commerce convenience.

---

## Key Features

- **Specialized Vegetarian Taxonomy:** Filtering by strict culinary preferences including vegan, gluten-free, organic, and Jain preparations.
- **Resilient Shopping Cart:** Client-persisted cart state with automatic stock validation and price verification upon checkout.
- **Secure Authentication Pipeline:** JSON Web Token (JWT) session authorization with bcrypt password encryption and protected route middleware.
- **Order Orchestration Workflow:** End-to-end order processing status transitions: Placed -> Confirmed -> Preparing -> Out for Delivery -> Completed.
- **Automated Catalog Seeding:** Integrated seed scripts for generating realistic menu structures, pricing, and category hierarchies.
- **Ultra-Fast Frontend:** Built with React 19 and Vite 8, offering instantaneous route navigation via React Router 7.

---

## Use Cases

### For Consumers & Diners
- Explore categorized vegetarian cuisines with detailed ingredient transparency.
- Customize items, manage multiple delivery addresses, and track real-time order status.

### For Restaurant Kitchen Operators
- Monitor live orders on an administrative dashboard with one-click status updates.
- Toggle item availability and adjust pricing in real-time.

### For Developers & System Architects
- Reference pattern for structuring an Express 5 REST API with Mongoose 9 schemas.
- Clean separation of concerns between authentication, business controllers, and data access objects.

---

## System Architecture

```
+---------------------------------------------------------------+
|              Frontend Client (React 19 + Vite 8)              |
|  - React Router 7 Navigation     - Tailwind CSS v4 Theme      |
|  - Persistent Cart Store         - Toast Notifications        |
+---------------------------------------------------------------+
                                |  REST API (Axios / JSON)
                                v
+---------------------------------------------------------------+
|               Backend Server (Node.js + Express 5)            |
|  - JWT Auth Middleware           - Express Validator          |
|  - Order Management Service      - Product Routing Engine     |
+---------------------------------------------------------------+
                                |  Mongoose 9 ODM
                                v
+---------------------------------------------------------------+
|                     MongoDB Document Store                    |
|  - Users & Roles                 - Products & Categories      |
|  - Order Records                 - Delivery Details           |
+---------------------------------------------------------------+
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend Framework | React 19.2, React DOM 19.2 |
| Build Tool | Vite 8, @vitejs/plugin-react |
| Routing & State | React Router 7, React Context |
| Styling | Tailwind CSS v4, Lucide React, React Hot Toast |
| Backend Runtime | Node.js, Express 5.2 |
| Database & ODM | MongoDB, Mongoose 9.7 |
| Security & Auth | JSON Web Token (jsonwebtoken), bcryptjs |
| HTTP & Utilities | Axios, date-fns, morgan, cors, dotenv |

---

## Project Structure

```
Vindela/
├── frontend/             # React 19 client application
│   ├── src/
│   │   ├── components/   # Navbar, CartDrawer, FoodCard, Footer
│   │   ├── pages/        # Home, Menu, OrderTracking, Checkout, Login
│   │   ├── context/      # AuthContext and CartContext providers
│   │   └── App.jsx       # Root router configuration
│   ├── package.json
│   └── vite.config.js
├── backend/              # Express 5 REST API
│   ├── src/
│   │   ├── controllers/  # authController, productController, orderController
│   │   ├── models/       # User.js, Product.js, Order.js (Mongoose)
│   │   ├── routes/       # authRoutes.js, productRoutes.js, orderRoutes.js
│   │   ├── middleware/   # authMiddleware.js, errorHandler.js
│   │   └── seed/         # seed.js (pre-populated vegetarian database)
│   ├── server.js         # Server bootstrap and database connection
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance (local or MongoDB Atlas connection URI)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/vindela
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Seed the database with menu items:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Launch the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application in your browser at `http://localhost:5173`

---

## Future Roadmap

- Integration with payment gateways (Stripe / Razorpay).
- Geolocation-based delivery tracking with live driver mapping.
- Kitchen Display System (KDS) interface with audio order notifications.
- Customer review and dietary rating system.

---

## License

This project is licensed under the ISC License.
