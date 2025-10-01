# Payecards Telegram Bot (MongoDB)

A production-minded Telegram bot built with **Node.js + Telegraf + MongoDB (Mongoose)**, implementing:
- User registration (username + email)
- Crypto prices via CoinGecko
- **Watchlist**: add/remove/list tracked symbols
- Admin broadcast
- Inline keyboards
- Logging, error handling
- Unit tests (Vitest)
- Dockerized deploy (Mongo + Bot)

## Setup
1. Clone repo & install deps
   ```bash
   npm i
   cp .env.example .env
   # fill BOT_TOKEN, ADMIN_IDS, MONGODB_URI
   ```
2. Dev
   ```bash
   docker compose up -d mongo
   npm run dev
   ```
3. Build & Start
   ```bash
   npm run build && npm start
   ```
4. Docker (both services)
   ```bash
   docker compose up --build -d
   ```

## Commands
- `/start` – welcome + main menu
- `Register` – prompts email (reply to register)
- `/price <symbol>` – e.g., `/price btc` (reply includes **Add to Watchlist** button)
- `Prices` – inline menu for BTC/ETH/SOL/USDT
- `/watchlist` – show your list
- `/watchlist add <SYMBOL>` – add to watchlist
- `/watchlist remove <SYMBOL>` – remove from watchlist
- `/broadcast <message>` – **admin-only**

## Design Considerations
- MongoDB schema keeps `watchlist: string[]` for O(1) membership ops via `$addToSet` & `$pull`.
- All watchlist actions exposed via both **inline buttons** and **slash commands**.
- Idempotent registration via `updateOne(..., { upsert: true })`.

## Security
- Secrets via env vars. Never commit `.env`.
- Admin allowlist via `ADMIN_IDS`.

## Testing
```bash
npm test
```

## Deployment Notes
- Works on any Node host (Render/Fly/EC2). Docker compose includes Mongo.
- Healthcheck on `PORT` for uptime pings.

## Submission Details
Include in README bottom or submission email:
- Full Name
- Email
- GitHub Username