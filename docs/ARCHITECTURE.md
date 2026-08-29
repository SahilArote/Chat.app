# Pulse Chat — System Architecture Reference

## Overview
Pulse Chat is an enterprise-ready, high-throughput real-time messaging application architected as a **Modular Monolith** in TypeScript on Node.js / Express 5 with MongoDB, Cloudinary, and Socket.IO.

---

## Architectural Principles

1. **Domain-Driven Module Boundaries**:
   - Each business capability (`auth`, `users`, `conversations`, `messages`, `media`, `notifications`) is encapsulated in `src/modules/<domain>/` with its own controller, service, validation schemas, and types.
2. **Layered Decoupling**:
   - Controllers handle HTTP transport and delegation.
   - Services contain pure business rules and data access orchestration.
   - Infrastructure abstractions isolate database connections, email dispatches, and cloud storage.
3. **Enterprise API Standards**:
   - All responses follow the unified `{ success, data, error, meta: { requestId, timestamp } }` envelope.
   - Strict Zod validation on incoming `body`, `query`, and `params`.
   - Centralized error codes (`ErrorCode`).
4. **Resilient Real-time Infrastructure**:
   - Decoupled Socket.IO handlers for presence, chat rooms, messaging, and typing.
   - Ready for horizontal scaling across nodes via Redis adapter.

---

## Directory Structure

```text
src/
├── app.ts                         # Application bootstrap & middleware composition
├── config/                        # Environment configuration
├── infrastructure/
│   ├── database/mongoose.ts       # Mongoose connector with DNS SRV fallback
│   ├── storage/cloudinary.ts      # Cloudinary media stream uploader
│   └── email/email.service.ts     # Nodemailer transactional emailer
├── middleware/
│   ├── auth.middleware.ts         # JWT authentication guard
│   ├── error.middleware.ts        # Centralized error handler & logger
│   ├── rateLimit.middleware.ts    # Tiered brute-force & DDoS rate limiting
│   ├── requestId.middleware.ts    # Request tracing & X-Request-Id injection
│   ├── sanitize.middleware.ts     # In-place NoSQL query injection protection
│   ├── upload.middleware.ts       # Multer memory storage
│   └── validate.middleware.ts     # Zod schema validation middleware
├── modules/
│   ├── auth/                      # AuthService, AuthController, AuthValidation, AuthRoutes
│   ├── users/                     # UserService, UserController, UserValidation, UserModel
│   ├── conversations/             # ConversationService, ConversationController, ConversationModel
│   ├── messages/                  # MessageService, MessageController, MessageModel
│   ├── media/                     # MediaService, MediaController, MediaRoutes
│   └── notifications/             # NotificationModel, NotificationTypes
├── routes/
│   └── v1.router.ts               # Primary API v1 route aggregator
├── utils/
│   ├── apiResponse.ts             # Standard envelope generator
│   ├── errorCodes.ts              # System-wide error code enumeration
│   ├── logger.ts                  # Winston structured logging
│   ├── pagination.ts              # Universal cursor & offset pagination helper
│   ├── ApiError.ts                # Custom operational error class
│   └── generateToken.ts           # JWT token generator
└── websocket/
    ├── socket.server.ts           # Socket server initialization
    ├── socket.events.ts           # Socket event name constants
    ├── socket.types.ts            # Socket payload & ack interfaces
    ├── socket.auth.ts             # Socket handshake authentication
    ├── socket.adapter.ts          # Redis adapter configuration
    └── handlers/                  # Modular event handlers (chat, presence, typing, conversation)
```
