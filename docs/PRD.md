# Product Requirements Document (PRD)
### Vindela — Full-Stack Culinary Commerce Platform

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document outlines the product requirements, user personas, reservation logic, and architectural specifications for the **Vindela** fine-dining reservation and restaurant capacity management system.

---

## Document Metadata

<div style="background-color: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 18px 20px; margin: 14px 0;">
  <table width="100%" cellpadding="0" cellspacing="6" border="0">
    <tr>
      <td width="20%"><span style="color: #8B949E; font-size: 12px; font-weight: 600;">Version:</span></td>
      <td><code style="color: #F0F6FC; font-size: 12px;">1.0</code></td>
    </tr>
    <tr>
      <td><span style="color: #8B949E; font-size: 12px; font-weight: 600;">Date:</span></td>
      <td><span style="color: #F0F6FC; font-size: 12px;">October 31, 2026</span></td>
    </tr>
    <tr>
      <td><span style="color: #8B949E; font-size: 12px; font-weight: 600;">Author:</span></td>
      <td><span style="color: #F0F6FC; font-size: 12px; font-weight: 600;">Abhishek Perumalla</span></td>
    </tr>
    <tr>
      <td><span style="color: #8B949E; font-size: 12px; font-weight: 600;">Status:</span></td>
      <td><span style="background-color: #1E1B4B; color: #34D399; border: 1px solid #065F46; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.03em;">PRODUCTION RELEASE</span></td>
    </tr>
    <tr>
      <td><span style="color: #8B949E; font-size: 12px; font-weight: 600;">Target Launch:</span></td>
      <td><code style="color: #F0F6FC; font-size: 12px;">MVP (v1.0)</code></td>
    </tr>
  </table>
</div>

---

### 1. Product Overview

**Vindela** is a production-grade restaurant management and fine-dining reservation platform built on React 19, Express 5, and MongoDB. It seamlessly unifies customer-facing table reservations with an administrative operations center. Customers can browse floor plans, search real-time table availability across fixed 2-hour dining windows, and instantly confirm bookings. Simultaneously, restaurant managers have complete oversight over seating allocations, guest check-ins, booking statuses, and peak dining utilization metrics.

---

### 2. Problem Statement

Modern hospitality venues suffer from inefficient booking management and friction:
* **Double-Booking & Race Conditions**: Inadequately synchronized databases allow two diners to simultaneously secure the same physical table.
* **Manual Telephone Booking Friction**: Overburdened front-of-house staff spend hours fielding calls rather than serving seated diners.
* **Lack of Capacity Optimization**: Fixed table capacities are often poorly matched to party sizes, leaving high-capacity tables underutilized.
* **Opaque Reservation States**: Diners lack real-time confirmation status, while restaurant managers lack an operational overview of floor seating.

---

### 3. Goals

* **Zero Booking Overlaps**: Guarantee 100% conflict-free table reservations through atomic database validation.
* **Instant Availability Filtering**: Evaluate table capacities and available time slots in $< 200$ ms.
* **Dual-Role Authorization**: Provide strict role-based access control (RBAC) separating customer booking capabilities from administrative controls.
* **Modern High-Performance UX**: Leverage React 19, Vite 8, and Tailwind CSS v4 for a fluid, mobile-responsive reservation flow.

---

### 4. Target Users

* **Restaurant Patrons & Diners**: Seeking instant table confirmation, transparent time-slot selection, and self-service reservation management.
* **Restaurant Managers & Hosts**: Requiring an administrative command center to monitor live table occupancies, view guest counts, and update reservation statuses.
* **Executive Chefs & Kitchen Staff**: Benefiting from predictable guest counts and booking forecasts across service windows.

---

### 5. Core Features (MVP)

1. **Conflict-Free Availability Engine**:
   * Pre-filters tables where `table.capacity >= partySize`.
   * Evaluates confirmed and pending bookings for target calendar dates.
   * Dynamically removes booked fixed 2-hour blocks from the available slot picker.
   * Enforces atomic database double-check during booking checkout to prevent race conditions.
2. **Customer Reservation Portal**:
   * Date and party-size selector with date-fns integration.
   * Real-time table selection with visual capacity indicators.
   * User dashboard displaying active, completed, and past dining reservations.
   * One-click booking cancellation within allowable policy windows.
3. **Administrative Operations Command Center**:
   * Complete overview of all daily bookings and dining party allocations.
   * Manual booking status overrides (`Pending`, `Confirmed`, `Seated`, `Cancelled`).
   * Dynamic restaurant capacity and table configuration dashboard.
4. **JWT Authentication & Security**:
   * Secure user registration and login with bcryptjs password hashing.
   * Role-based middleware verifying `user` vs. `admin` permissions on protected endpoints.
   * Express-validator sanitization guarding all incoming payloads.

---

### 6. Non-Functional Requirements

* **Performance**: Table availability queries resolve in $< 150$ ms under concurrent search traffic.
* **Data Integrity**: Acid-compliant Mongoose validation preventing negative party sizes or non-existent slot bookings.
* **Responsive Design**: Mobile-first UI scaling seamlessly from smartphones to desktop management screens.