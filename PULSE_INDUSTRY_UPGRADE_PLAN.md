# PULSE CHAT — INDUSTRY-GRADE UPGRADE & REACT NATIVE IMPLEMENTATION PLAN

## Project Goal

Transform Pulse Chat from its current full-stack MVP into a production-grade messaging platform with a WhatsApp-class architecture.

Target capabilities:

- Reliable 1-to-1 and group messaging
- React Native Android and iOS applications
- Offline-first messaging
- Multi-device sessions
- Real-time delivery/read states
- Push notifications
- Scalable Socket.IO infrastructure
- Redis and background queues
- Secure authentication
- Direct media uploads and processing
- Strong observability, testing and CI/CD
- End-to-end encryption as a later major milestone
- WebRTC calling as a later major milestone

## Current Project Baseline

The current application uses Node.js, Express, Socket.IO, MongoDB/Mongoose, JWT/bcryptjs, Nodemailer, Cloudinary, Multer and a Vanilla JS web frontend. Existing features include DMs, groups, OTP verification, media/file uploads, read receipts, replies, reactions, message deletion and multi-device socket connection tracking.

Do not replace working functionality blindly. Every migration must preserve existing behavior unless the phase explicitly changes it.

---

# PHASE 0 — BACKUP AND FREEZE

## Objective

Create a safe rollback point before architectural changes.

### Tasks

1. Ensure the repository is clean.
2. Pull the latest main branch.
3. Create an upgrade branch.
4. Tag the current MVP.
5. Record current Node/npm versions.
6. Record current environment variables without committing secrets.
7. Export/back up the database if appropriate.
8. Record the current deployment configuration.

### Suggested Git commands

```bash
git checkout main
git pull origin main
git checkout -b upgrade/industry-architecture
git tag v1.0.0-mvp
git push origin v1.0.0-mvp
```

### Deliverables

- `v1.0.0-mvp`
- `upgrade/industry-architecture`
- `docs/CURRENT_STATE.md`

---

# PHASE 1 — ACTUAL CODE AUDIT

## Objective

Understand what the source code actually does before changing architecture.

Inspect:

```text
src/app.js
src/socket/index.js
src/controllers/
src/models/
src/routes/
src/middlewares/
src/services/
src/config/
public/
package.json
```

### Audit areas

- Authentication
- Authorization
- REST APIs
- Socket events
- Message creation
- Message delivery
- Read receipts
- Reactions
- Replies
- Message deletion
- Groups
- User search
- Uploads
- Cloudinary
- OTP
- Error handling
- Validation
- Database queries
- Indexes
- Environment handling
- Deployment
- Security

### Deliverables

```text
docs/
├── CURRENT_ARCHITECTURE.md
├── DATABASE_AUDIT.md
├── API_AUDIT.md
├── SOCKET_AUDIT.md
├── SECURITY_AUDIT.md
└── PERFORMANCE_AUDIT.md
```

Do not refactor before this audit is complete.

---

# PHASE 2 — TYPESCRIPT MIGRATION

## Objective

Move the backend from JavaScript to TypeScript without changing behavior.

Target:

```text
Node.js
TypeScript
Express
Socket.IO
Mongoose
```

### Migration order

1. Configuration
2. Utilities
3. Middleware
4. Services
5. Models
6. Repositories
7. Controllers
8. Routes
9. Socket layer
10. Application entry point

Do not rewrite business logic unnecessarily during this phase.

### Deliverables

- `tsconfig.json`
- Type-safe backend
- Successful production build
- Existing APIs still working
- Existing Socket.IO behavior preserved

---

# PHASE 3 — MODULAR BACKEND

## Objective

Create clear domain boundaries.

Target structure:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── devices/
│   ├── conversations/
│   ├── messages/
│   ├── media/
│   ├── notifications/
│   └── presence/
│
├── infrastructure/
│   ├── database/
│   ├── redis/
│   ├── queue/
│   ├── storage/
│   └── push/
│
├── websocket/
├── middleware/
├── config/
└── utils/
```

Each module should preferably contain:

```text
controller
service
repository
schema
routes
types
```

### Rule

Business logic belongs in services, not route handlers.

---

# PHASE 4 — API V1

Move APIs toward:

```text
/api/v1/auth
/api/v1/users
/api/v1/devices
/api/v1/conversations
/api/v1/messages
/api/v1/media
/api/v1/notifications
```

Keep backward compatibility temporarily if required.

Do not break the mobile/web clients during migration.

---

# PHASE 5 — REQUEST VALIDATION

Replace the validation stub with a real schema validation system.

Recommended:

```text
Zod
```

Request flow:

```text
Request
  ↓
Authentication
  ↓
Validation
  ↓
Authorization
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

Every important endpoint must validate:

- body
- query
- params
- allowed enum values
- size limits
- authorization context

---

# PHASE 6 — STANDARD API AND ERROR SYSTEM

All successful APIs should use a predictable structure:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "req_xxx"
  }
}
```

Errors:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Message not found"
  },
  "meta": {
    "requestId": "req_xxx"
  }
}
```

Create centralized error codes.

---

# PHASE 7 — LOGGING AND REQUEST TRACING

Introduce structured logging.

Recommended:

```text
Pino
```

Every request should have a request ID.

Log:

- requestId
- userId
- route
- method
- status
- duration
- error code
- important business events

Never log:

- passwords
- OTP values
- refresh tokens
- private message plaintext
- API secrets

---

# PHASE 8 — AUTHENTICATION REBUILD

Current JWT authentication should evolve into:

```text
Short-lived Access Token
+
Rotating Refresh Token
+
Device Session
```

Recommended starting values:

```text
Access token: 10–15 minutes
Refresh token: 30–90 days
```

Refresh tokens should be stored securely and preferably represented server-side by hashes.

Implement:

- login
- logout current device
- logout all devices
- refresh
- revoke session
- password change invalidation

---

# PHASE 9 — DEVICE MODEL

Create a Device collection.

Example:

```text
Device
├── userId
├── deviceId
├── platform
├── deviceName
├── pushToken
├── appVersion
├── osVersion
├── lastActiveAt
├── createdAt
└── updatedAt
```

One account must support multiple devices.

Example:

```text
User
├── Android
├── iPhone
├── Chrome
└── Tablet
```

---

# PHASE 10 — SESSION MANAGEMENT

Create a Session collection.

Recommended fields:

```text
userId
deviceId
refreshTokenHash
createdAt
expiresAt
lastUsedAt
ip
userAgent
revokedAt
```

Implement device/session management.

---

# PHASE 11 — OTP SECURITY

Replace plaintext OTP storage with:

```text
otpHash
otpExpiresAt
otpAttempts
lastOtpSentAt
```

Implement:

- expiration
- attempt limit
- resend cooldown
- IP rate limiting
- user rate limiting
- device rate limiting

Never log OTP values.

---

# PHASE 12 — USER MODEL REFACTOR

Separate user concerns:

```text
User
Profile
Device
Session
PrivacySettings
NotificationSettings
```

Keep the User model focused on identity/authentication.

---

# PHASE 13 — CONVERSATION MODEL REFACTOR

Current conversation membership should evolve toward:

## Conversation

```text
_id
type
name
avatar
createdBy
lastMessageId
createdAt
updatedAt
```

## ConversationMember

```text
conversationId
userId
role
joinedAt
leftAt
lastReadMessageId
lastReadAt
muted
archived
pinned
notificationEnabled
```

This enables scalable unread state, member permissions and per-user chat settings.

---

# PHASE 14 — MESSAGE MODEL REFACTOR

Target:

```text
Message
├── _id
├── conversationId
├── senderId
├── clientMessageId
├── sequenceNumber
├── type
├── text
├── attachments
├── replyTo
├── status
├── editedAt
├── deletedAt
├── createdAt
└── updatedAt
```

Important:

`clientMessageId` is generated by the client and is used for idempotency.

`sequenceNumber` supports message ordering and gap detection.

---

# PHASE 15 — ATTACHMENT MODEL

Move media metadata away from the core Message document.

Example:

```text
Attachment
├── messageId
├── type
├── url
├── thumbnailUrl
├── mimeType
├── size
├── width
├── height
├── duration
└── encryptionInfo
```

Support:

- images
- video
- documents
- audio
- voice messages

---

# PHASE 16 — DATABASE INDEXES

Create and verify indexes based on actual query patterns.

Important candidates:

```text
Message:
conversationId + createdAt

ConversationMember:
conversationId + userId

User:
username
email

Device:
userId + deviceId

Session:
userId
```

Use MongoDB `explain()` and profiling to verify query performance.

Do not add unnecessary indexes.

---

# PHASE 17 — CURSOR PAGINATION

Move message history away from page-based pagination.

Prefer:

```text
GET /messages/:conversationId?before=<cursor>&limit=50
```

Requirements:

- stable ordering
- opaque cursor where appropriate
- no duplicate messages between pages
- efficient indexes
- support loading older messages

---

# PHASE 18 — UNREAD SYSTEM

Use `ConversationMember`:

```text
lastReadMessageId
lastReadAt
```

Implement:

- unread count
- unread divider
- read receipts
- chat list badges

Avoid updating every message document when a user reads a conversation.

---

# PHASE 19 — REDIS

Introduce Redis.

Use it for:

- presence
- socket state
- caching
- rate limiting
- OTP throttling
- pub/sub
- distributed locks
- temporary state

Principle:

```text
Redis = fast/temporary/distributed state
MongoDB = durable application state
```

---

# PHASE 20 — SOCKET.IO REDIS ADAPTER

Current in-memory socket tracking is acceptable for a single server.

For multiple backend instances:

```text
Node #1
Node #2
Node #3
   ↓
Redis
```

Add the Socket.IO Redis adapter.

Verify:

- cross-instance messages
- presence updates
- room events
- disconnect handling
- reconnect behavior

---

# PHASE 21 — PRESENCE SERVICE

Move live presence into Redis.

Redis:

```text
online state
socket/device state
heartbeat
```

MongoDB:

```text
lastSeen
```

Implement:

- online
- offline
- last seen
- heartbeat timeout
- multiple device presence

---

# PHASE 22 — MESSAGE DELIVERY PROTOCOL

Formalize message states:

```text
LOCAL
SENDING
SENT
DELIVERED
READ
```

Protocol:

```text
Client
 ↓
send_message
 ↓
Server
 ↓
Database
 ↓
ACK
 ↓
SENT
```

Recipient receives:

```text
message.created
```

Then sender receives:

```text
message.delivered
```

When opened:

```text
message.read
```

---

# PHASE 23 — IDEMPOTENCY

Every outgoing message must have:

```text
clientMessageId = UUID
```

Server checks whether the same message has already been processed.

If a retry arrives:

```text
same clientMessageId
```

return the existing message instead of creating a duplicate.

Test:

- normal send
- timeout + retry
- socket reconnect + retry
- app restart + retry

---

# PHASE 24 — MESSAGE ORDERING

Assign a sequence number per conversation.

Example:

```text
1001
1002
1003
1004
```

Client detects:

```text
1001
1002
1004
```

and knows `1003` is missing.

Implement a sync/recovery request for missing sequences.

---

# PHASE 25 — OFFLINE SYNC PROTOCOL

Create a synchronization mechanism.

Example:

```text
lastSyncCursor
```

On reconnect:

```text
Client
 ↓
lastSyncCursor
 ↓
Server
 ↓
missing events/messages
 ↓
SQLite/local store
 ↓
new cursor
```

Requirements:

- no duplicates
- no missing messages
- deterministic ordering
- retry support
- safe app restart

---

# PHASE 26 — MOBILE OUTBOX

React Native needs a persistent outgoing message queue.

Example:

```text
Outbox
├── messageId
├── conversationId
├── payload
├── status
├── retryCount
└── createdAt
```

Flow:

```text
User sends
 ↓
SQLite
 ↓
Outbox
 ↓
Socket
 ↓
ACK
 ↓
remove from outbox
```

Offline messages remain pending until synchronized.

---

# PHASE 27 — BACKGROUND QUEUES

Introduce:

```text
BullMQ
+
Redis
```

Queues:

```text
notifications
email
media
cleanup
analytics
```

Heavy work must not block normal API requests.

---

# PHASE 28 — PUSH NOTIFICATIONS

Store push tokens per Device.

Flow:

```text
Message created
 ↓
Recipient online?
 ├── YES → Socket
 └── NO  → Notification queue
                ↓
             FCM/APNs
```

Implement notification deduplication and appropriate privacy settings.

---

# PHASE 29 — MEDIA UPLOAD ARCHITECTURE

Current backend uploads through Node/Multer to Cloudinary.

For large files, evolve toward:

```text
Mobile
 ↓
Request signed upload
 ↓
Cloudinary/Object Storage
 ↓
Direct upload
 ↓
Backend receives metadata
 ↓
Message created
```

This reduces backend bandwidth and memory pressure.

---

# PHASE 30 — MEDIA PROCESSING

Use background workers for:

```text
Images:
original → thumbnail → optimized

Video:
upload → metadata → thumbnail → processing

Documents:
upload → validation → storage
```

Track:

```text
uploading
processing
ready
failed
```

---

# PHASE 31 — REACT NATIVE APPLICATION

Create:

```text
pulse-mobile/
```

Recommended:

```text
React Native
Expo
TypeScript
Expo Router
```

Architecture:

```text
app/
src/
├── api/
├── socket/
├── database/
├── store/
├── components/
├── services/
├── hooks/
└── utils/
```

Use the same backend APIs as web.

Do not create a second backend.

---

# PHASE 32 — MOBILE AUTHENTICATION

Screens:

```text
Splash
Login
Register
OTP
Forgot Password
```

Store sensitive authentication data using platform-secure storage.

Implement:

- token refresh
- session restoration
- logout
- revoked-session handling

---

# PHASE 33 — MOBILE CHAT LIST

Implement:

- conversations
- DMs
- groups
- unread badges
- last message
- timestamps
- presence
- pinned chats
- muted chats
- archived chats

Use efficient virtualization for large lists.

---

# PHASE 34 — MOBILE CHAT SCREEN

Implement:

```text
Header
Messages
Date separators
Unread divider
Typing indicator
Reply preview
Composer
Attachment menu
```

Message bubble:

```text
content
timestamp
status
reaction
reply
```

---

# PHASE 35 — MOBILE LOCAL DATABASE

Use SQLite or another reliable local database layer.

Tables:

```text
users
conversations
conversation_members
messages
attachments
reactions
outbox
sync_state
```

Principle:

```text
Local DB = fast UI/read cache + offline state
Server = authoritative durable state
```

---

# PHASE 36 — MOBILE SOCKET MANAGER

Create exactly one central socket manager per app session.

Responsibilities:

- connect
- disconnect
- reconnect
- authenticate
- subscribe
- unsubscribe
- ACK handling
- event routing

Do not create a new socket for every chat screen.

---

# PHASE 37 — MOBILE STATE MANAGEMENT

Recommended separation:

```text
TanStack Query
→ server/API state

Zustand
→ application/UI state

SQLite
→ durable local chat state
```

Avoid keeping the complete message history only in React state.

---

# PHASE 38 — OFFLINE-FIRST MOBILE

Implement:

```text
UI
 ↓
SQLite
 ↓
Outbox
 ↓
Socket/API
```

Offline:

```text
message = pending
```

Online:

```text
pending
 ↓
sending
 ↓
sent
 ↓
delivered
 ↓
read
```

---

# PHASE 39 — RECONNECTION AND SYNC

Handle:

```text
WiFi
 ↓
4G
 ↓
offline
 ↓
WiFi
```

On reconnection:

```text
lastSyncCursor
 ↓
server
 ↓
missing data
 ↓
SQLite
```

The user should not need to manually refresh.

---

# PHASE 40 — MOBILE MEDIA

Implement:

- camera
- gallery
- video picker
- document picker
- image compression
- video compression
- upload progress
- retry
- cancellation

UI should clearly show upload state.

---

# PHASE 41 — GROUP CHAT

Roles:

```text
OWNER
ADMIN
MEMBER
```

Features:

- create group
- add member
- remove member
- promote admin
- demote admin
- rename group
- group image
- leave group
- delete group

Use centralized authorization rules.

---

# PHASE 42 — MESSAGE ACTIONS

Implement:

```text
Reply
React
Edit
Delete for me
Delete for everyone
Forward
Copy
Star
Pin
```

Each action requires:

- authorization
- validation
- database update
- socket event
- local database update

---

# PHASE 43 — SEARCH

Implement:

```text
User search
Conversation search
Message search
```

Start with MongoDB-compatible indexed queries.

Move to dedicated search only if actual scale requires it.

---

# PHASE 44 — NOTIFICATION SETTINGS

Implement global and per-conversation settings:

```text
Message notifications
Group notifications
Mentions
Sound
Vibration
Preview
Mute
```

---

# PHASE 45 — PRIVACY SETTINGS

Implement:

```text
Last seen
Profile photo
About
Read receipts
Group invitations
Blocked users
```

Privacy must be enforced server-side, not just hidden in the UI.

---

# PHASE 46 — DISAPPEARING MESSAGES

Support:

```text
Off
24 hours
7 days
30 days
```

Message field:

```text
expiresAt
```

Use a worker for cleanup.

---

# PHASE 47 — VOICE MESSAGES

Implement:

```text
Record
Pause
Resume
Playback
Seek
Playback speed
Waveform
Upload
```

Treat audio as an attachment.

---

# PHASE 48 — SECURITY HARDENING

Final security layer:

```text
Helmet
CORS
Rate limiting
Zod validation
JWT/session validation
RBAC
Secure token storage
File validation
MIME validation
Request limits
Audit logging
Security logging
```

Never trust client-side authorization.

---

# PHASE 49 — AUTOMATED TESTING

Backend:

```text
Unit
Integration
API
Socket
```

Mobile:

```text
Component
State
Database
Sync
```

E2E:

```text
Register
Login
OTP
Send
Receive
Retry
Read
Offline
Reconnect
Media
Groups
Logout
```

Prioritize critical business logic instead of blindly targeting 100% coverage.

---

# PHASE 50 — CI/CD

GitHub Actions pipeline:

```text
Pull Request
 ↓
Install
 ↓
Lint
 ↓
Typecheck
 ↓
Unit tests
 ↓
Integration tests
 ↓
Build
 ↓
Security scan
 ↓
Deploy staging
```

Production:

```text
main
 ↓
approval
 ↓
production
```

---

# PHASE 51 — ENVIRONMENTS

Maintain:

```text
development
staging
production
```

Separate:

- MongoDB
- Redis
- storage
- push credentials
- email
- JWT secrets

Never use production secrets locally.

---

# PHASE 52 — OBSERVABILITY

Recommended:

```text
Sentry
Prometheus
Grafana
```

Track:

```text
API latency
5xx errors
socket connections
active users
messages/sec
database latency
Redis latency
queue depth
upload failures
push failures
```

Create alerts for critical failures.

---

# PHASE 53 — BACKUPS AND DISASTER RECOVERY

Configure:

- automated database backups
- point-in-time recovery where available
- retention policy
- restore procedure
- disaster recovery documentation

Test actual restoration periodically.

---

# PHASE 54 — E2EE DESIGN

Only after reliable messaging and multi-device architecture are stable.

Target:

```text
Sender device
 ↓
Encrypt locally
 ↓
Server stores ciphertext
 ↓
Recipient device
 ↓
Decrypt locally
```

Do not invent custom cryptography.

Use a proven protocol/library and have the design independently reviewed before claiming WhatsApp-level security.

---

# PHASE 55 — MULTI-DEVICE E2EE

Each device needs identity/key material.

Implement:

```text
Device registration
Key distribution
Session establishment
Key rotation
Device verification
Device revocation
New-device handling
```

This is a separate major engineering milestone.

---

# PHASE 56 — ENCRYPTED MEDIA

For private media:

```text
Device
 ↓
Encrypt file
 ↓
Upload encrypted blob
 ↓
Storage
 ↓
Recipient downloads
 ↓
Decrypt locally
```

The storage layer should not need plaintext media.

---

# PHASE 57 — WEBRTC CALLING

Use:

```text
WebRTC
```

for media.

Use Socket.IO only for signaling.

Architecture:

```text
Caller
 ↓
Socket signaling
 ↓
Receiver

Caller ←── WebRTC ──→ Receiver
             │
          STUN/TURN
```

Start with:

1. 1-to-1 voice
2. 1-to-1 video
3. group calls

---

# PHASE 58 — LOAD AND SCALE TESTING

Test progressively:

```text
100 users
1,000 users
10,000 users
```

Measure:

- concurrent sockets
- messages/sec
- API latency
- CPU
- RAM
- MongoDB latency
- Redis latency
- queue latency
- notification latency

Optimize based on measurements.

---

# PHASE 59 — HORIZONTAL SCALING

When required:

```text
Load Balancer
 ├── Node #1
 ├── Node #2
 └── Node #3
        ↓
      Redis
        ↓
     MongoDB
```

Scale application instances independently.

---

# PHASE 60 — SERVICE EXTRACTION

Only after real scaling requirements justify it.

Potential services:

```text
Auth
Messages
Notifications
Media
Presence
Calls
```

Start as a modular monolith.

Extract services only when:

- independent scaling is needed
- deployment independence is valuable
- team boundaries justify it
- measurable bottlenecks exist

---

# FINAL TARGET ARCHITECTURE

```text
                         CLOUDFLARE
                            │
                       LOAD BALANCER
                            │
             ┌──────────────┴──────────────┐
             │                             │
        Node API #1                   Node API #2
             │                             │
             └──────────────┬──────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
             MongoDB      Redis       BullMQ
                │           │           │
                │           │        Workers
                │           │           │
                │           │     ┌─────┼─────┐
                │           │     │     │     │
                │           │   Push  Email Media
                │
         Durable State
                │
        ┌───────┼────────┐
        │       │        │
      Users   Chats   Messages
        │
      Devices
        │
     Sessions
```

Clients:

```text
React Web
     │
     ├──────────────┐
     │              │
React Native     React Native
 Android             iOS
```

Later:

```text
E2EE
+
Encrypted Media
+
WebRTC
```

---

# Engineering Rules

1. Do not rewrite the whole application at once.
2. Do not create a second backend for React Native.
3. Do not jump to microservices prematurely.
4. Do not jump to Kubernetes prematurely.
5. Do not implement E2EE using custom cryptography.
6. Do not trust client-side authorization.
7. Do not perform heavy media/notification/email processing inside API requests.
8. Do not rely only on Socket.IO memory state for distributed deployments.
9. Do not rely only on React state for chat history.
10. Do not deploy architectural changes without tests.
11. Preserve existing functionality during migrations.
12. Benchmark before making performance claims.
13. Every major phase must have a rollback strategy.
14. Every phase should update technical documentation.

---

# AI Coding Agent Rules

When using Antigravity, Claude, Gemini or another coding agent, do not give it the entire roadmap as one implementation prompt.

For each phase, instruct the agent to:

1. Inspect the existing implementation.
2. Identify affected files.
3. Explain the proposed changes.
4. Implement only the requested phase.
5. Preserve existing functionality.
6. Run lint/typecheck/tests.
7. Fix all errors.
8. Verify APIs and socket behavior.
9. Update documentation.
10. Provide a summary of changed files.
11. Provide migration/rollback instructions.
12. Do not silently introduce unrelated architecture changes.

---

# Definition of Done

A phase is NOT complete merely because the code compiles.

A phase is complete when:

```text
Implementation
+
Tests
+
Validation
+
Existing-feature verification
+
Documentation
+
Deployment verification
```

are all complete.

---

# Recommended Immediate Work

Start with only:

```text
PHASE 0
↓
PHASE 1
```

Do not start React Native yet.

First establish exactly what the existing source code does. Then create the target architecture and begin the backend migration.

After Phase 1 is complete, proceed to:

```text
Phase 2 → TypeScript
Phase 3 → Modular Backend
Phase 4 → API v1
...
```

The React Native application should begin after the backend contracts, authentication, device model, message protocol and realtime behavior are stable enough to consume.

