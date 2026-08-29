# Pulse Chat — API v1 Reference

All responses use the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "req_1788027474179_228d4b6d",
    "timestamp": "2026-08-29T18:17:54.188Z"
  }
}
```

---

## 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Rate Limit | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new user & send OTP | 15 / 15 min | No |
| `POST` | `/verify-otp` | Verify 6-digit email OTP | 15 / 15 min | No |
| `POST` | `/resend-otp` | Resend OTP code | 15 / 15 min | No |
| `POST` | `/login` | Authenticate user & get JWT | 15 / 15 min | No |
| `GET` | `/me` | Get current authenticated user | 300 / 15 min | Yes (Bearer) |
| `POST` | `/logout` | Invalidate active session & mark offline | 300 / 15 min | Yes (Bearer) |

---

## 2. Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/search?q={query}` | Search users by username or email | Yes |
| `GET` | `/:id` | Get user profile by 24-hex ID | Yes |

---

## 3. Conversations (`/api/v1/conversations`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get current user's active conversations | Yes |
| `POST` | `/` | Create or retrieve Direct Message room | Yes |
| `POST` | `/group` | Create group chat with 2+ members | Yes |
| `GET` | `/:id` | Get conversation details by ID | Yes |
| `PATCH` | `/group/:id/add` | Add member to group (Admin only) | Yes |
| `PATCH` | `/group/:id/remove`| Remove member from group (Admin only) | Yes |
| `DELETE`| `/:id` | Soft-delete conversation for user | Yes |

---

## 4. Messages (`/api/v1/messages`)

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/:conversationId` | `content`, `type`, `replyTo` | Send message (Limit: 60/min) |
| `GET` | `/:conversationId` | `page`, `limit`, `cursor`, `before`, `after` | Get messages with pagination |
| `DELETE`| `/:id` | `?deleteFor=me|everyone` | Delete message |
| `PATCH` | `/:id/react` | `emoji` | Add/toggle reaction |
| `PATCH` | `/:id/read` | None | Mark message as read |

---

## 5. Media (`/api/v1/media` & `/api/v1/upload`)

| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/image` | `multipart/form-data` (`file`) | Upload image to Cloudinary |
| `POST` | `/video` | `multipart/form-data` (`file`) | Upload video to Cloudinary |
| `POST` | `/file` | `multipart/form-data` (`file`) | Upload generic document |
| `POST` | `/avatar`| `multipart/form-data` (`file`) | Update user avatar |
