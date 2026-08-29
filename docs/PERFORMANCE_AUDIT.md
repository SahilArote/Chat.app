# Performance & Scalability Audit — Pulse Chat MVP

## 1. Identified Performance Bottlenecks

### 1.1 In-Memory File Buffering (`multer.memoryStorage()`)
- **Current Behavior:** Large media files (up to 50MB) are read completely into Node.js heap memory before being piped to Cloudinary via upload streams.
- **Impact:** 10 simultaneous 50MB video uploads will consume ~500MB+ of Node RAM, risking `ERR_WORKER_OUT_OF_MEMORY` crashes on 512MB RAM instances (e.g. Render free tier).
- **Remedy:** Implement client-direct signed uploads (`Phase 29`).

### 1.2 Unbounded Database Growth & Offset Pagination
- **Current Behavior:** Message pagination uses `.skip((page - 1) * limit)`.
- **Impact:** For a conversation with 50,000 messages, retrieving page 1,000 causes MongoDB to scan and discard 30,000 index entries, resulting in high query latency.
- **Remedy:** Implement indexed cursor pagination (`?before=<cursor>&limit=50`) using `{ conversationId: 1, _id: -1 }` or `{ conversationId: 1, sequenceNumber: -1 }`.

### 1.3 Database Write Amplification on Connection State
- **Current Behavior:** Every socket `connection` and `disconnect` performs an immediate database update (`User.findByIdAndUpdate(userId, { status, lastSeen })`).
- **Impact:** In mobile environments with unstable network connectivity (rapid disconnect/reconnect cycles), this generates massive write IOPS on MongoDB.
- **Remedy:** Move ephemeral presence and heartbeats to Redis (`Phase 21`) and persist `lastSeen` to MongoDB only on debounce or complete session termination.

### 1.4 Synchronous Email Dispatch
- **Current Behavior:** OTP email sending (`sendOTP`) is executed inline during the HTTP request cycle using Nodemailer SMTP transport.
- **Impact:** If Gmail SMTP latency is 1.5–3 seconds, the registration/login API response is blocked for 3 seconds.
- **Remedy:** Offload email dispatch to an asynchronous background worker queue using BullMQ + Redis (`Phase 27`).

---

## 2. Infrastructure Scaling Limits (Current vs Target)

| Metric | Current MVP Limit | Target Architecture Capability |
| :--- | :--- | :--- |
| **Max Concurrent Sockets** | ~1,000 (Single Node Process) | 100,000+ (Multi-Node Cluster with Redis Adapter) |
| **Message Throughput** | ~50 msgs/sec | 5,000+ msgs/sec |
| **Max Group Size** | ~50 members (Array Contention) | 10,000+ members (Normalized `ConversationMember`) |
| **Memory Footprint** | Volatile (Spikes on media upload) | Stable & bounded (Direct S3/Cloudinary storage) |
| **Offline Resilience** | None (Web client drops messages) | Guaranteed outbox queue + local SQLite sync |
