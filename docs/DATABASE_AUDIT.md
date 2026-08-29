# Database Audit — Pulse Chat MVP

## 1. Schema Analysis

### 1.1 `User` Schema (`src/models/User.js`)
- **Fields:**
  - `username` (String, required, unique, trim, min: 3)
  - `email` (String, required, unique, lowercase, regex match)
  - `password` (String, required, min: 6, `select: false`)
  - `avatar` (String)
  - `bio` (String, max: 200)
  - `status` (Enum: `['online', 'offline']`, default: `'offline'`)
  - `lastSeen` (Date, default: `Date.now`)
  - `isVerified` (Boolean, default: `false`)
  - `otp` (`{ code: String, expiresAt: Date }`)
  - `fcmToken` (String)
  - `passwordChangedAt` (Date)
- **Hooks & Methods:**
  - `pre('save')`: Hashes password with `bcrypt.hash(..., 10)`.
  - `comparePassword()`: Compares candidate password.
  - `passwordChangedAfter()`: Validates token issued timestamp against password change.
- **Audit Findings & Deficiencies:**
  1. Plaintext OTP storage in `otp.code` (security vulnerability).
  2. Single `fcmToken` field supports only 1 device per user (breaks multi-device roadmap).
  3. Ephemeral status (`online`/`offline`) written directly to database on connect/disconnect causing write amplification.

---

### 1.2 `Conversation` Schema (`src/models/Conversation.js`)
- **Fields:**
  - `type` (Enum: `['dm', 'group']`, required)
  - `name` (String, default: `''`)
  - `members` (`[ObjectId -> User]`)
  - `admins` (`[ObjectId -> User]`)
  - `groupAvatar` (String)
  - `lastMessage` (`ObjectId -> Message`)
  - `deletedFor` (`[ObjectId -> User]`)
- **Indexes:**
  - `{ members: 1 }`
- **Audit Findings & Deficiencies:**
  1. Unbounded arrays: `members`, `admins`, `deletedFor` are stored inside the document.
  2. Lacks per-user conversation state (e.g. `lastReadMessageId`, unread counter, `pinned`, `muted`, `archived`).
  3. In a 500-member group, reading/updating chat metadata mutates a shared array.

---

### 1.3 `Message` Schema (`src/models/Message.js`)
- **Fields:**
  - `conversationId` (`ObjectId -> Conversation`, required)
  - `senderId` (`ObjectId -> User`, required)
  - `type` (Enum: `['text', 'image', 'video', 'file']`, default: `'text'`)
  - `content` (String)
  - `fileUrl` (String), `fileName` (String), `fileSize` (Number)
  - `replyTo` (`ObjectId -> Message`)
  - `reactions` (`[{ userId: ObjectId, emoji: String }]`)
  - `readBy` (`[{ userId: ObjectId, readAt: Date }]`)
  - `deletedFor` (`[ObjectId -> User]`)
  - `deletedAt` (Date, default: `null`)
- **Indexes:**
  - `{ conversationId: 1, createdAt: -1 }`
  - `{ senderId: 1 }`
- **Audit Findings & Deficiencies:**
  1. Lacks `clientMessageId` for client-side idempotency.
  2. Lacks `sequenceNumber` for gap detection and deterministic ordering.
  3. `readBy` array grows with every recipient in a group chat, causing high write contention and document fragmentation.
  4. Media fields are mixed directly into the message schema rather than normalized in an `Attachment` entity.

---

### 1.4 `Notification` Schema (`src/models/Notification.js`)
- **Fields:**
  - `userId` (`ObjectId -> User`, required)
  - `type` (Enum: `['msg', 'mention', 'req']`, required)
  - `fromUserId` (`ObjectId -> User`, required)
  - `conversationId` (`ObjectId -> Conversation`)
  - `messageId` (`ObjectId -> Message`)
  - `isRead` (Boolean, default: `false`)
  - `title`, `body` (String)
- **Indexes:**
  - `{ userId: 1, isRead: 1, createdAt: -1 }`
- **Audit Findings:** Schema is clean and properly indexed for unread notifications query.

---

## 2. Index & Query Efficiency Summary

| Query Pattern | Existing Index | Efficiency | Recommendation |
| :--- | :--- | :--- | :--- |
| User lookup by email/username | Unique index on `email`, `username` | High ($O(1)$) | Keep |
| Search user by query regex | None | Poor ($O(N)$ collection scan) | Add text index or indexed prefix search |
| Fetch user conversations | `{ members: 1 }` | Moderate | Transition to `ConversationMember` table |
| Fetch paginated messages | `{ conversationId: 1, createdAt: -1 }` | Moderate | Shift from offset/skip to cursor pagination |
| Fetch unread notifications | `{ userId: 1, isRead: 1, createdAt: -1 }` | High | Keep |
