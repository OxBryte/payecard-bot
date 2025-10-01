import type { Telegraf, Context } from "telegraf";
import { logger } from "../config";

// Error handler middleware
export function withErrorHandling(bot: Telegraf<Context>) {
  bot.catch((err, ctx) => {
    logger.error({ err }, "Bot error");
    try {
      ctx.reply("⚠️ An unexpected error occurred. Please try again later.");
    } catch {}
  });
}
