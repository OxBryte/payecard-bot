# Payecards Telegram Bot (MongoDB)

A production-minded Telegram bot built with **Node.js + Telegraf + MongoDB (Mongoose)**, implementing:

- User registration (username + email)
- Crypto prices via CoinGecko
- Admin broadcast
- Inline keyboards
- Logging, error handling
- Unit tests (Vitest)

## Setup

1. Clone repo & install deps
   ```bash
   npm i
   cp .env.example .env
   # fill BOT_TOKEN, ADMIN_IDS, MONGODB_URI
   ```
2. Dev
   ```bash
   npm run dev
   ```
3. Build & Start
   ```bash
   npm run build && npm start
   ```

## Commands

- `/start` – welcome + menu buttons
- `/popular` – shows top 10 trending or popular coins from coingecko api
- `/broadcast <message(contains image, text, video)>` – **admin-only**
- `/profile` - shows your profile information

## Design Considerations

- The MongoDB User schema stores each user's `telegramId`, `username`, and `email` also it uses `updateOne(..., { upsert: true })` to ensure no duplicate users are created.

## Security

- Secrets via env vars. Never commit `.env`.
- Admin allowlist via `ADMIN_IDS`.

## Testing

```bash
npm test
```

## Deployment Notes

- Works on any Node host (AWS/Render/Railway/Heroku/Docker). Docker compose includes Mongo.
- Healthcheck on `PORT` for uptime pings.

## Submission Details

Include in README bottom or submission email:

- Full Name
- Email
- GitHub Username
