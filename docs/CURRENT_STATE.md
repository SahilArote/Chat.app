# Current State Baseline — Pulse Chat MVP (v1.0.0-mvp)

## 1. System Environment & Runtime
- **Node.js Version:** `v24.13.0`
- **npm Version:** `11.6.2`
- **Module System:** CommonJS (`"type": "commonjs"`)
- **Git Baseline Tag:** `v1.0.0-mvp`
- **Upgrade Branch:** `upgrade/industry-architecture`

## 2. Core Dependencies
| Package | Version | Role / Purpose |
| :--- | :--- | :--- |
| `express` | `^5.2.1` | HTTP API Web Framework |
| `socket.io` | `^4.8.3` | Real-time WebSocket Transport |
| `mongoose` | `^9.4.1` | MongoDB ODM |
| `jsonwebtoken` | `^9.0.3` | Authentication Tokens |
| `bcryptjs` | `^3.0.3` | Password Hashing |
| `cloudinary` | `^2.9.0` | Cloud Media Storage & Transformation |
| `multer` | `^2.1.1` | Multi-part Form Data / Memory File Buffer |
| `nodemailer` | `^8.0.6` | OTP Email Dispatch (Gmail SMTP) |
| `helmet` | `^8.1.0` | HTTP Header Security |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing |
| `morgan` | `^1.10.1` | HTTP Request Logger |
| `express-rate-limit` | `^8.3.2` | Rate Limiting (Installed, unconfigured in app) |
| `joi` | `^18.1.2` | Validation Library (Installed, unconfigured) |

## 3. Environment Variables Specification (Non-Secret Schema)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Application HTTP Port | `3000` |
| `NODE_ENV` | Runtime Environment | `development` / `production` |
| `MONGO_URI` | MongoDB Atlas SRV Connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `<string>` |
| `JWT_EXPIRES_IN` | JWT expiration duration | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Cloud Name | `<string>` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `<string>` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `<string>` |
| `EMAIL_USER` | Gmail SMTP sender email address | `<email>` |
| `EMAIL_PASS` | Gmail App Password | `<app-password>` |
| `RENDER_URL` | Self-ping URL for Render sleep prevention | `https://chat-app-r36i.onrender.com` |

## 4. Current Deployment Configuration
- **Platform:** Render (Free Tier Web Service)
- **Keep-Alive Strategy:** In-process 14-minute interval `https.get()` to `/health` endpoint to prevent Render instance sleep.
- **Static Assets:** Served directly by Express (`/public` and `/uploads`).
- **Database:** MongoDB Atlas (M0 Shared Cluster).
