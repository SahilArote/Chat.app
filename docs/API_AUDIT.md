# REST API Audit — Pulse Chat MVP

## 1. Complete API Catalog

### 1.1 Authentication Routes (`/api/auth`)
| Method | Endpoint | Protection | Payload / Params | Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ username, email, password }` | `{ success: true, message, email }` | `400` (User/Email exists) |
| `POST` | `/api/auth/verify-otp` | Public | `{ email, otp }` | `{ success: true, token, user }` | `400` (Invalid/Expired OTP), `404` |
| `POST` | `/api/auth/resend-otp` | Public | `{ email }` | `{ success: true, message }` | `400` (Already verified), `404` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ success: true, token, user }` | `401` (Invalid creds), `403` (Unverified) |
| `GET` | `/api/auth/me` | Bearer JWT | None | `{ success: true, user }` | `401` |
| `POST` | `/api/auth/logout` | Bearer JWT | None | `{ success: true, message }` | `401` |

### 1.2 User Routes (`/api/users`)
| Method | Endpoint | Protection | Payload / Params | Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/search` | Bearer JWT | Query `?q=<term>` | `{ success: true, users: [] }` | `401` |
| `GET` | `/api/users/:id` | Bearer JWT | Param `:id` | `{ success: true, user }` | `401`, `404` |

### 1.3 Conversation Routes (`/api/conversations`)
| Method | Endpoint | Protection | Payload / Params | Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/conversations` | Bearer JWT | None | `{ success: true, conversations: [] }` | `401` |
| `POST` | `/api/conversations` | Bearer JWT | `{ userId }` | `{ success: true, conversation }` | `400` (Self-DM), `401`, `404` |
| `POST` | `/api/conversations/group` | Bearer JWT | `{ name, members: [] }` | `{ success: true, conversation }` | `400` (<2 members), `401` |
| `GET` | `/api/conversations/:id` | Bearer JWT | Param `:id` | `{ success: true, conversation }` | `401`, `404` |
| `PATCH` | `/api/conversations/group/:id/add` | Bearer JWT | Param `:id`, `{ userId }` | `{ success: true, conversation }` | `400`, `401`, `403`, `404` |
| `PATCH` | `/api/conversations/group/:id/remove` | Bearer JWT | Param `:id`, `{ userId }` | `{ success: true, conversation }` | `400`, `401`, `403`, `404` |
| `DELETE` | `/api/conversations/:id` | Bearer JWT | Param `:id` | `{ success: true, message }` | `401`, `404` |

### 1.4 Message Routes (`/api/messages`)
| Method | Endpoint | Protection | Payload / Params | Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/messages/:conversationId` | Bearer JWT | Param `:conversationId`, `{ content, type, replyTo }` | `{ success: true, message }` | `400`, `401`, `404` |
| `GET` | `/api/messages/:conversationId` | Bearer JWT | Param `:conversationId`, Query `?page=1&limit=30` | `{ success: true, messages: [], pagination: {} }` | `401`, `404` |
| `DELETE` | `/api/messages/:id` | Bearer JWT | Param `:id`, Query `?deleteFor=me\|everyone` | `{ success: true, message }` | `401`, `403`, `404` |
| `PATCH` | `/api/messages/:id/react` | Bearer JWT | Param `:id`, `{ emoji }` | `{ success: true, reactions: [] }` | `401`, `404` |
| `PATCH` | `/api/messages/:id/read` | Bearer JWT | Param `:id` | `{ success: true, message }` | `401`, `404` |

### 1.5 Upload Routes (`/api/upload`)
| Method | Endpoint | Protection | Payload / Params | Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/image` | Bearer JWT | Multipart `file` | `{ success: true, url, fileName, size, type }` | `400`, `401` |
| `POST` | `/api/upload/video` | Bearer JWT | Multipart `file` | `{ success: true, url, fileName, size, type }` | `400`, `401` |
| `POST` | `/api/upload/file` | Bearer JWT | Multipart `file` | `{ success: true, url, fileName, size, type }` | `400`, `401` |
| `POST` | `/api/upload/avatar` | Bearer JWT | Multipart `file` | `{ success: true, url }` | `400`, `401` |

---

## 2. API Design Gaps & Upgrades Required

1. **No URL Versioning:** Routes are mounted at `/api/*` instead of `/api/v1/*`.
2. **Inconsistent Response Shapes:**
   - Some responses return `{ success: true, message: "..." }` while others return `{ success: true, conversation: { ... } }` without standard metadata (`requestId`, `meta`).
3. **No Schema Validation Middleware:** `validate.js` is empty. Incoming parameters and bodies rely on manual `if (!x) throw ApiError` statements.
4. **Offset Pagination:** Messages endpoint uses `skip((page - 1) * limit)`. As chats grow, offset pagination skips rows inefficiently and causes missed/duplicated messages when new items arrive concurrently.
