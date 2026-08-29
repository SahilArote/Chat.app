# System Architecture Audit — Pulse Chat MVP

## 1. High-Level Architecture Overview

Pulse Chat currently operates as a **Monolithic Node.js/Express application** coupled with **Socket.IO** running in a single process.

```text
[ Browser Client ]
  │
  ├── REST Requests ──► [ Express 5 App ] ──► [ MongoDB (Mongoose 9) ]
  │                             │
  │                             └──► [ Cloudinary / Nodemailer ]
  │
  └── WebSocket (WS) ─► [ Socket.IO Server (In-Memory Map) ]
```

### Component Breakdown
1. **HTTP Layer (`src/app.js`):**
   - Express 5.2.1 application hosting JSON endpoints under `/api/*`.
   - Serves static frontend files from `/public` and local file uploads from `/uploads`.
2. **Real-time Layer (`src/socket/index.js`):**
   - Socket.IO server attached to Node HTTP server.
   - Connection state and socket ID tracking managed strictly in-memory via `Map<userId, Set<socketId>>`.
   - Rooms mapped directly to MongoDB `conversationId`.
3. **Data Layer (`src/models/*`):**
   - 4 Mongoose models: `User`, `Conversation`, `Message`, `Notification`.
   - MongoDB Atlas cluster accessed via Mongoose ODM.
4. **Third-Party Integrations:**
   - **Cloudinary:** Media asset storage and resizing transformations.
   - **Nodemailer / Gmail:** 6-digit numeric OTP delivery.

---

## 2. Directory Layout & Layer Responsibilities

| Directory / File | Type | Current Responsibility | Architectural Limitations |
| :--- | :--- | :--- | :--- |
| `src/app.js` | Entry Point | Server bootstrap, middleware registration, route mounting, self-ping cron | Mixed concerns (HTTP, static server, keep-alive interval) |
| `src/config/` | Config | Environment variable extraction and Cloudinary/Mongoose initialization | No runtime environment validation |
| `src/controllers/` | Controller | Handles HTTP request/response, validation logic, and direct Mongoose DB operations | Business logic mixed into controllers; no service layer abstraction |
| `src/middlewares/` | Middleware | JWT verification (`auth.js`), file upload parsing (`upload.js`), global error formatting | `validate.js` is empty (0 bytes) |
| `src/models/` | Models | Mongoose schema definitions and hooks (password hashing) | Denormalized arrays (`members`, `readBy`, `reactions`, `deletedFor`) without member subdocuments |
| `src/routes/` | Routing | Express router endpoint definitions mapping to controller methods | Lacks API versioning (`/api/v1`) |
| `src/services/` | Services | Only `emailService.js` exists | Domain business logic is trapped in controllers instead of services |
| `src/socket/` | WebSocket | Realtime event listeners and room broadcasts | Ephemeral state in-memory; no pub/sub for horizontal scaling |
| `src/utils/` | Utilities | Error helpers, token generator, async wrapper | Scattered helpers |

---

## 3. Communication Flow

### Message Flow (Dual Path: REST & Socket)
Currently, messages can be sent via **two different routes**:
1. **REST POST** `/api/messages/:conversationId` $\rightarrow$ Saves to MongoDB $\rightarrow$ Returns JSON (does **not** emit Socket event).
2. **Socket.IO Event** `send_message` $\rightarrow$ Saves to MongoDB $\rightarrow$ Emits `message_received` to room `conversationId`.

> [!WARNING]
> This dual implementation creates split-brain logic where REST-created messages do not broadcast in real time to connected socket clients.
