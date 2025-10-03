# Payecards Telegram Bot (MongoDB)

A production-minded Telegram bot built with **Node.js + Telegraf + MongoDB (Mongoose)**, implementing:

- **User Management** - Registration with email validation
- **Crypto Prices** - Real-time token prices via CoinGecko
- **Admin Broadcast** - Mass messaging with delivery tracking
- **Event-Driven Architecture** - Events for background processing
- **Dependency Injection** - Clean, testable SOLID architecture

## Setup

1. Clone repo & install deps
   ```bash
   npm i
   ```
2. Create `.env` file with:
   ```bash
   BOT_TOKEN=your_telegram_bot_token
   ADMIN_IDS=123456789,987654321
   MONGODB_URI=mongodb://localhost:27017/payecard
   COINGECKO_BASE=https://api.coingecko.com/api/v3
   PORT=8080
   ```
3. Run development server
   ```bash
   npm run dev
   ```
4. Production build & start
   ```bash
   npm run build
   npm start
   ```

## Docker

```bash
# Build and run
docker build -t payecard-bot .
docker run -d --name payecard-bot --env-file .env -p 8080:8080 payecard-bot
```

## Commands

- `/start` – welcome + menu buttons
- `/popular` – shows top 10 trending or popular coins from coingecko api
- `/broadcast <message(contains image, text, video)>` – **admin-only**
- `/profile` - shows your profile information

## Database Architecture

The bot uses an **optimized MongoDB connection** with enterprise-grade features:

- **Connection Pooling** - Min 2, Max 10 connections for optimal performance
- **Auto-Retry Logic** - 5 retry attempts with exponential backoff
- **Event Monitoring** - Real-time connection state tracking
- **Shutdown** - Proper cleanup on shutdown
- **Single Connection Pattern** - Single connection instance across the app

## Design Considerations

- The MongoDB User schema stores each user's `telegramId`, `username`, and `email` also it uses `updateOne(..., { upsert: true })` to ensure no duplicate users are created.

## Security

- Secrets via env vars. Never commit `.env`.
- Admin allowlist via `ADMIN_IDS`.

## Deployment Notes

- Works on any Node host (AWS/Render/Railway/Heroku)
- Docker Compose includes MongoDB with persistent volumes
- Automatic restart on failure
