# Pulse Chat — Production Deployment Guide

## 1. Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`production` or `development`) | `production` |
| `PORT` | Server HTTP port | `3000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/chat` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_secure_secret_string` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `EMAIL_HOST` | SMTP Host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP Port | `587` |
| `EMAIL_USER` | SMTP User / Email | `your-app@gmail.com` |
| `EMAIL_PASS` | SMTP App Password | `abcd efgh ijkl mnop` |
| `REDIS_URL` | Optional Redis URL for horizontal socket clustering | `redis://redis:6379` |

---

## 2. Docker Deployment

### Run using Docker Compose:
```bash
docker-compose up -d --build
```

### Build and run standalone container:
```bash
docker build -t pulse-chat:latest .
docker run -p 3000:3000 --env-file .env pulse-chat:latest
```

---

## 3. Render / Cloud Platform Deployment

1. **Build Command**: `npm ci --legacy-peer-deps && npm run build`
2. **Start Command**: `npm start`
3. Set all required environment variables in the cloud dashboard.
4. Ensure MongoDB Atlas Network Access permits your cloud provider IP addresses (`0.0.0.0/0` with secure credentials).
