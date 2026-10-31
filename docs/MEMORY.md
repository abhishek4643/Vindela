# Project Memory
### Vindela — Engineering Context, Operational State, and Architectural History

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document maintains operational context, key architectural decisions, and runtime constraints to ensure continuity across development sessions, automated agent workflows, and human contributors.

---

### Current Phase: Phase 5 — Production Release
* **Last Updated**: October 31, 2026
* **Status**: Complete &amp; Verified (100% Concurrency Pass Rate)

### High-Level Checklist
- [x] Phase 1: Database Schemas &amp; Core Data Models
- [x] Phase 2: Express 5 REST API &amp; Authentication
- [x] Phase 3: Reservation Availability &amp; Conflict Prevention Engine
- [x] Phase 4: React 19 Frontend &amp; Tailwind v4 UI
- [x] Phase 5: Verification, Admin Command Center &amp; Production Delivery

---

### Current Status

<div style="background-color: #0D1117; border-left: 4px solid #10B981; border-radius: 6px; padding: 16px 20px; margin: 12px 0;">
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>React 19 &amp; Vite 8 Frontend Operational</b> (table picker, time-slot selector, and toast notifications active).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>Express 5 API Gateway Active</b> (JWT authentication, role guards, and CORS middleware configured).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>Conflict-Free Availability Engine Verified</b> (zero double-bookings across fixed 2-hour dining windows).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>MongoDB Schemas &amp; Seeders Implemented</b> (User, Table, and Reservation collections indexed).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>Admin Command Center Operational</b> (table capacity overrides, booking status management, and guest counts).</p>
  <p style="margin: 6px 0; color: #F0F6FC;">[x] <b>Production Documentation Suite Active</b> (aligned with visual UI standard across all 6 files).</p>
</div>

---

### Completed Milestones

| ID | Milestone Description | Completed Date |
| :-: | :-- | :-: |
| **1.1** | Design MongoDB collections for tables, reservations, and authenticated users | Jul 04, 2026 |
| **1.2** | Implement Express 5 REST endpoints with JWT authorization middleware | Jul 06, 2026 |
| **1.3** | Build conflict-free availability engine with pre-checkout atomic locks | Jul 08, 2026 |
| **1.4** | Develop React 19 SPA with Tailwind CSS v4, date-fns, and Lucide icons | Jul 10, 2026 |
| **1.5** | Implement administrative command center with table occupancy controls | Jul 11, 2026 |
| **1.6** | Publish complete architectural documentation suite in `docs/` | Oct 31, 2026 |

---

### Key Architectural Decisions Log

* **ADR-001: Fixed 2-Hour Service Slots (`VALID_TIME_SLOTS`)**: Simplifies floor turnaround times, prevents fragmented partial-hour vacancies, and eliminates unpredictable guest overlap.
* **ADR-002: Double-Check Verification on Reservation Save**: When multiple diners attempt to reserve the same table concurrently, a final availability check directly prior to document save eliminates race conditions.
* **ADR-003: Stateless JWT with Role Claims (`user` / `admin`)**: Avoids database lookups on every request while maintaining secure, instant role validation across protected management routes.

---

### Operational Constraints & Guardrails

1. **Party Size Boundaries**: Diners cannot reserve tables where `guestCount > table.capacity`. Larger parties must book multiple tables or contact management.
2. **Cancellation Grace Periods**: Cancellations are restricted to active bookings prior to reservation start times. Completed or seated bookings are immutable.
3. **Seeding in Production**: The database seeder script in `backend/src/seed/seed.js` must only be run in development or testing environments; never execute seeders against production MongoDB clusters.
