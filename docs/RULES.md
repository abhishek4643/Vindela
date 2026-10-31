# Development Rules
### Vindela — Engineering Standards and Collaboration Guidelines

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,20,26&height=8&section=header&width=100%" width="100%" />
</div>

This document defines the development rules, coding standards, and best practices to be followed across the **Vindela** repository. These guidelines ensure reservation data integrity, clean React 19 component design, robust Express 5 API security, and seamless collaboration between human developers and AI assistants.

---

### <span style="background-color: #4F46E5; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">1</span> General Principles
*These rules apply to both frontend and backend.*

<div style="background-color: #0D1117; border-left: 4px solid #4F46E5; border-radius: 6px; padding: 16px 20px; margin: 12px 0;">
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <b>Follow the project documentation</b> (<code>PRD.md</code>, <code>ARCHITECTURE.md</code>, <code>DESIGN.md</code>) before modifying booking logic.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <b>Maintain strict separation of concerns.</b> Keep API business logic in controllers, database operations in models, and UI rendering in components.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <b>Enforce transactional reservation integrity.</b> Never confirm a reservation without verifying table capacity and time-slot availability.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <b>Make atomic, focused commits</b> that keep linting and server build scripts passing.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <b>Never commit hardcoded secrets</b> (JWT secrets, MongoDB URIs) into source code or repository history.</p>
</div>

---

### <span style="background-color: #4F46E5; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">2</span> Technology & Coding Standards
*Rules related to core languages, frameworks, and tools:*

| Category | Standard & Directive |
| :-- | :-- |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">React 19</span> | Use functional components and modern React hooks (`useState`, `useEffect`, `useContext`). Never use legacy class components. |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Tailwind CSS v4</span> | Use standard utility classes matching the design system; avoid arbitrary pixel values where standard tokens exist. |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Node / Express 5</span> | Use `async/await` for asynchronous controller handlers; pass unexpected errors to `next(err)`. |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Mongoose 9</span> | Define strict schema validations (required fields, enum status codes, index unique keys). |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Authentication</span> | Verify JWT bearer tokens on all `/api/reservations` mutations and restrict `/api/admin/*` to `role === 'admin'`. |
| <span style="background-color: #1E1B4B; color: #A5B4FC; border: 1px solid #4F46E5; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Dates & Times</span> | Always format and compare dates in ISO 8601 (`YYYY-MM-DD`) using `date-fns` to avoid timezone offset discrepancies. |

---

### <span style="background-color: #4F46E5; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">3</span> Directory Boundaries
*Follow defined architectural domains in <code>ARCHITECTURE.md</code>:*

<div style="background-color: #0D1117; border-left: 4px solid #4F46E5; border-radius: 6px; padding: 16px 20px; margin: 12px 0;">
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <code>frontend/src/pages</code> owns route-level views; individual UI widgets reside in <code>frontend/src/components</code>.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <code>backend/src/controllers</code> handles business logic and responds with standardized JSON schemas.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <code>backend/src/middleware</code> strictly handles auth verification, payload validation, and CORS.</p>
  <p style="margin: 6px 0; color: #F0F6FC;">&bull; <code>backend/src/seed</code> owns standalone database initialization logic and must not be imported in production routes.</p>
</div>

---

### <span style="background-color: #4F46E5; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">4</span> Reservation & Booking Integrity Guidelines

* **Capacity Enforcement**: Reject any reservation request where `guestCount > table.capacity`.
* **Atomic Availability Verification**: Always perform an in-database availability verification right before executing `reservation.save()` to prevent concurrent booking race conditions.
* **Status Lifecycles**: Reservations must follow strict state transitions: `pending` &rarr; `confirmed` &rarr; `seated` &rarr; `completed` (or `cancelled`).
* **Cancellation Policies**: Customers can only cancel their own reservations; administrative status overrides require admin privileges.

---

### <span style="background-color: #4F46E5; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">5</span> AI Collaboration Guidelines (Cursor & Agent Rules)

* **Read `MEMORY.md` First**: Always check active phase, completed tasks, and architectural decisions before writing code.
* **Preserve API Contracts**: Never modify existing REST endpoint signatures (`GET /api/tables/available`, `POST /api/reservations`) without updating docs.
* **Maintain Documentation Sync**: Update `TASKS.md` and `MEMORY.md` whenever new features or seed schemas are implemented.

---

### <span style="background-color: #EA4335; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-right: 6px;">6</span> Prohibited Patterns

* **Do not** store plaintext passwords; always hash with `bcryptjs.hash()` using salt rounds $\ge 10$.
* **Do not** hardcode MongoDB connection strings or JWT secret keys in repository files.
* **Do not** execute unindexed Mongoose queries across large reservation datasets.
* **Do not** allow clients to supply arbitrary reservation IDs to update without ownership checks.
