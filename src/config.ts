import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

export const CONFIG = {
  // Bot token from telegram botfather
  BOT_TOKEN: process.env.BOT_TOKEN ?? "",
  ADMIN_IDS: (process.env.ADMIN_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Mongodb uri from mongodb
  MONGODB_URI: process.env.MONGODB_URI ?? "",

  // Coingecko base from coingecko
  COINGECKO_BASE:
    process.env.COINGECKO_BASE ?? "",
  PORT: Number(process.env.PORT ?? 8080),
};

// Logger for the bot
export const logger = pino({ level: "info", base: undefined });
