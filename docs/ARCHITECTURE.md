# System Architecture
### Vindela — Architectural Topology, Availability Engine, and System Specifications

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document describes the overall system architecture, technology stack, directory structure, table availability algorithms, and key design decisions for the **Vindela** restaurant management and reservation platform.

---

### 1. High-Level Architecture

Vindela follows a decoupled client-server architecture connecting a high-performance React 19 single-page application with an Express 5 REST API and MongoDB persistence layer:

<p align="center" style="margin: 20px 0;">
  <img src="./architecture.svg" alt="Vindela Architecture Flow" width="100%" />
</p>

---

### 2. Technology Stack

Technologies used across the Vindela platform and their architectural purpose:

| Layer | Technology | Implementation Detail |
| :-- | :-- | :-- |
| **Frontend Framework** | React 19 + React DOM 19 | High-performance component rendering with concurrent features and React Router v7 |
| **Build Tool & Bundler** | Vite 8 + @vitejs/plugin-react | Sub-millisecond HMR development server and optimized ES production bundling |
| **CSS & Design System** | Tailwind CSS v4 + @tailwindcss/vite | Utility-first responsive styling with zero CSS bloat and native CSS cascade layers |
| **Iconography & Polish** | Lucide React + react-hot-toast | Minimalist UI vector icons and non-blocking toast notifications |
| **Date & Time Utilities** | date-fns v4 | Lightweight immutable calendar formatting and date arithmetic |
| **API Gateway & Routing** | Express 5 + Node.js | Asynchronous REST endpoints with centralized error handling middleware |
| **Persistence Database** | MongoDB + Mongoose 9 | Document-oriented collections (`User`, `Table`, `Reservation`) with strict schemas |
| **Authentication & RBAC** | JWT (jsonwebtoken) + bcryptjs | Stateless bearer authentication and cryptographic password hashing (salt rounds: 10) |
| **Payload Validation** | express-validator 7 | Request sanitization and boundary schema checks preventing malformed inputs |
| **HTTP Client** | Axios 1.x | Configured base URL instance with automatic Authorization header interception |

---

### 3. Folder Structure

The project follows a clean client-server monorepo structure separating frontend UI components from backend controllers, models, and seed scripts:

```text
VINDELA/
|-- backend/                            # Express 5 REST API service
|   |-- src/
|   |   |-- config/                     # MongoDB connection setup
|   |   |-- controllers/                # Business logic (auth, reservations, tables, admin)
|   |   |-- middleware/                 # JWT verification & role-based access control
|   |   |-- models/                     # Mongoose schemas (User, Table, Reservation)
|   |   |-- routes/                     # API route declarations
|   |   `-- seed/                       # Database seeder for demo tables and admin user
|   |-- .env.example                    # Sample backend environment configuration
|   |-- package.json                    # Backend dependencies and run scripts
|   `-- server.js                       # Express application initialization & listener
|-- frontend/                           # React 19 Single-Page Application
|   |-- src/
|   |   |-- components/                 # Reusable UI elements (Navbar, Cards, Modals)
|   |   |-- context/                    # React Context for auth state and active user
|   |   |-- pages/                      # Client views (Home, Reserve, MyBookings, Admin)
|   |   |-- services/                   # Axios API service wrappers
|   |   |-- App.jsx                     # Route definitions and layout wrappers
|   |   |-- index.css                   # Tailwind v4 directives and theme variables
|   |   `-- main.jsx                    # React 19 DOM root mount
|   |-- index.html                      # HTML entrypoint
|   |-- package.json                    # Frontend dependencies and Vite build scripts
|   `-- vite.config.js                  # Vite 8 plugins and path resolution
|-- docs/                               # Engineering architecture & design specifications
|   |-- PRD.md                          # Product requirements & feature specifications
|   |-- ARCHITECTURE.md                 # System topology, data flow & tech stack
|   |-- RULES.md                        # Coding standards & reservation integrity rules
|   |-- DESIGN.md                       # Design system, UI tokens & visual palette
|   |-- TASKS.md                        # Phased task dashboard & execution tracker
|   `-- MEMORY.md                       # Session memory, active phase & decision logs
|-- .gitignore                          # Node modules, logs, and environment exclusions
`-- README.md                           # Quickstart guide, setup instructions & tour
```

---

### 4. Reservation Availability Engine Pipeline

```text
[ Customer Selects Date & Guest Count ]
                   |
                   v
  [ Step 1: Table Capacity Filtering ]
    (Query tables where capacity >= guestCount)
                   |
                   v
  [ Step 2: Query Active Bookings ]
    (Find confirmed/pending reservations for target date)
                   |
                   v
  [ Step 3: Slot Availability Matrix ]
    (Iterate 2-hour dining blocks: 11:00, 13:00, 15:00, 17:00, 19:00, 21:00)
    (Filter out time slots where table is already reserved)
                   |
                   v
  [ Step 4: Render Available Table Slots to Diner ]
                   |
                   v
  [ Step 5: Atomic Double-Check on Checkout ]
    (Verify table status right before saving to prevent race conditions)
                   |
      +------------+------------+
      |                         |
      v                         v
[ Status: CONFIRMED ]     [ Status: CONFLICT_ERROR ]
(200 OK + Booking ID)     (409 Conflict: Slot Taken)
```

---

### 5. Key Architectural Decisions (ADRs)

* **ADR-001: Fixed 2-Hour Dining Windows over Dynamic Durations**  
  *Rationale*: Fixed time slots (`11:00-13:00`, `13:00-15:00`, etc.) standardize kitchen cadence, simplify capacity modeling, and eliminate unpredictable turn-time overlaps across tables.
* **ADR-002: Client-Server Separation over Integrated Monolith**  
  *Rationale*: Maintaining distinct `frontend/` and `backend/` directories allows the React 19 client to be deployed to fast global edge CDNs (Vercel/Netlify) while the Express API scales independently.
* **ADR-003: Stateless JWT Authentication with Role Claims**  
  *Rationale*: Embedding user roles (`user` vs. `admin`) inside cryptographically signed JWT tokens eliminates repetitive database lookups on every authenticated API request while enforcing strict endpoint security.