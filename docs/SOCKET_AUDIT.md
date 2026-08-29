# Socket.IO Audit — Pulse Chat MVP

## 1. Connection & Authentication Flow

1. **Transport:** Polling + WebSocket (`cors: { origin: '*' }`).
2. **Handshake Auth:** `socket.handshake.auth.token` is verified with `jwt.verify(token, config.jwt.secret)`.
3. **User Binding:** Fetches user from DB via `User.findById(decoded.userId)` and attaches to `socket.user`.
4. **State Storage:**
   - Managed in-memory using `const onlineUsers = new Map();` where key is `userId` (String) and value is `Set<socketId>`.

---

## 2. Realtime Event Registry

### 2.1 Client-to-Server Events
| Event Name | Expected Payload | Handler Actions | Emits Resulting Events |
| :--- | :--- | :--- | :--- |
| `join_conversation` | `conversationId` | Verifies membership in MongoDB; joins room `socket.join(conversationId)` | `joined_conversation` (to sender), `error` (on fail) |
| `send_message` | `{ conversationId, content, type, replyTo }` | Saves `Message` in MongoDB, updates `Conversation.lastMessage`, populates sender | `message_received` (broadcasts to `io.to(conversationId)`) |
| `typing` | `{ conversationId }` | Broadcasts typing event to room (excluding sender) | `user_typing` (to `socket.to(conversationId)`) |
| `stop_typing` | `{ conversationId }` | Broadcasts stop typing event | `user_stop_typing` (to `socket.to(conversationId)`) |
| `mark_read` | `{ messageId, conversationId }` | Updates `Message.readBy` array in DB | `message_read` (to `socket.to(conversationId)`) |
| `message_reacted` | `{ messageId, reactions, conversationId }` | Relays updated reactions to room | `reaction_updated` (to `socket.to(conversationId)`) |
| `message_deleted` | `{ messageId, conversationId, content }` | Relays deleted state to room | `message_deleted_sync` (to `socket.to(conversationId)`) |
| `disconnect` | None | Removes socket from `onlineUsers` Map. If `Set` is empty, marks DB `status: offline` | `user_offline` (broadcast to all) |

### 2.2 Server-to-Client Events
| Event Name | Payload | Target Audience |
| :--- | :--- | :--- |
| `user_online` | `{ userId, username }` | Broadcast to all clients |
| `user_offline` | `{ userId, username, lastSeen }` | Broadcast to all clients |
| `joined_conversation` | `{ conversationId }` | Emitted to connecting socket |
| `message_received` | `{ message, conversationId }` | All sockets in room `conversationId` |
| `user_typing` | `{ userId, username, conversationId }` | Room members (excluding sender) |
| `user_stop_typing` | `{ userId, conversationId }` | Room members (excluding sender) |
| `message_read` | `{ messageId, userId, username }` | Room members (excluding sender) |
| `reaction_updated` | `{ messageId, reactions }` | Room members (excluding sender) |
| `message_deleted_sync`| `{ messageId, content }` | Room members (excluding sender) |
| `error` | `{ message }` | Direct socket error emission |

---

## 3. Structural Deficiencies & Scalability Bottlenecks

1. **In-Memory Cluster Incompatibility:** `onlineUsers` Map resides in single process memory. If the backend scales to 2+ Node instances, users connected to Instance A cannot send/receive events to/from users on Instance B.
2. **Missing ACKs & Idempotency:** The `send_message` event uses a fire-and-forget callback instead of a guaranteed request-acknowledgment (ACK) pattern with `clientMessageId`.
3. **No Delivery Receipt Stage:** The architecture only has `message_read` but lacks `message_delivered` (differentiating between reaching server vs reaching recipient device).
4. **Direct DB Writes in WebSocket Handlers:** Socket event handlers execute raw database write operations directly without passing through a shared service layer.
