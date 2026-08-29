# Security Audit — Pulse Chat MVP

## 1. Vulnerability Findings & Risk Matrix

| Risk Level | Area | Vulnerability Description | Remediation Required |
| :--- | :--- | :--- | :--- |
| 🔴 **CRITICAL** | OTP Security | OTP stored as plaintext `otp.code` in database. No rate limiting or brute force lockout on `/api/auth/verify-otp`. | Hash OTPs (`bcrypt`/`sha256`), add max attempt counter (e.g. 5 attempts), and implement Redis-backed IP/Account rate limiting. |
| 🔴 **CRITICAL** | JWT Invalidation | Tokens are long-lived (30 days) and stateless without server revocation mechanism or rotating refresh tokens. | Implement short-lived Access Tokens (15 min) + hashed rotating Refresh Tokens tied to a `Session` collection. |
| 🟠 **HIGH** | CORS Policy | `cors({ origin: '*' })` and Socket.IO `origin: '*'` permits arbitrary third-party web origins to connect. | Restrict CORS origin to trusted web/mobile app domains in production. |
| 🟠 **HIGH** | File Uploads | `upload.js` checks MIME type from client request header, which is easily spoofed. Buffer uploaded in memory. | Validate magic bytes/buffer signatures and stream directly to signed cloud URLs. |
| 🟡 **MEDIUM** | Rate Limiting | `express-rate-limit` package is in `package.json` but is never mounted in `app.js`. | Apply rate limiters to auth endpoints (`/login`, `/register`, `/verify-otp`, `/resend-otp`). |
| 🟡 **MEDIUM** | Password Hashing | `bcryptjs` used with 10 salt rounds in JS runtime. | Switch to native `bcrypt` or Argon2 with appropriate cost factor for higher throughput. |

---

## 2. Authentication & Authorization Review

- **Password Storage:** Uses Mongoose `pre('save')` hook with `bcryptjs.hash(..., 10)`. Properly excludes password by default via `select: false`.
- **Password Invalidation:** `passwordChangedAt` timestamp comparison in auth middleware is implemented cleanly (`user.passwordChangedAfter(decoded.iat)`).
- **Group Authorization:** Admin checks in `addMember` and `removeMember` check `admins.some(...)`, preventing non-admin modification. However, group settings changes (e.g. group name, avatar) lack central policy enforcement.
- **Message Deletion Access Control:** Properly prevents deleting messages for everyone unless the requesting user is the sender (`message.senderId === req.user._id`).
