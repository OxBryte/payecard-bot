import { Telegraf, session } from "telegraf";
import dotenv from "dotenv";
import { CONFIG, logger } from "./config";
import { connectMongo } from "./db/mongo";
import { User } from "./models/User";

import {
  startCommand,
  popularCommand,
  profileCommand,
  helpCommand,
  broadcastCommand,
  sendBroadcast,
} from "./commands";
import { BotContext, BotSession } from "./services/bot/bot.interface";
import { checkIsAdmin } from "./middlewares/isAdmin";

dotenv.config();

// Initialize bot
const token = CONFIG.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is not set in environment variables");
}

const bot = new Telegraf<BotContext>(token);
bot.use(session({ defaultSession: (): BotSession => ({}) }));

// Helper function for email validation for new users
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// All commands for the bot
bot.start(startCommand as any);
bot.command("popular", popularCommand);
bot.command("profile", profileCommand);
bot.command("help", helpCommand);
bot.command("broadcast", broadcastCommand as any);

bot.action("cmd_popular", async (ctx) => {
  await ctx.answerCbQuery();
  await popularCommand(ctx);
});

bot.action("cmd_profile", async (ctx) => {
  await ctx.answerCbQuery();
  await profileCommand(ctx);
});

bot.action("cmd_broadcast", async (ctx) => {
  await ctx.answerCbQuery();
  await broadcastCommand(ctx as BotContext);
});

// Handler for all messages (text, photo, video, etc.)
bot.on("message", async (ctx: BotContext) => {
  const message = (ctx.message as any).text?.trim() ?? "";

  // Handle broadcast messages (supports all message types)
  if (ctx.session.awaitingBroadcast) {
    // Check for cancel command
    if (message === "/cancel") {
      ctx.session.awaitingBroadcast = false;
      await ctx.reply("❌ Broadcast cancelled.");
      return;
    }

    // Send broadcast to all users (copies the entire message with media)
    ctx.session.awaitingBroadcast = false;
    await sendBroadcast(ctx);
    return;
  }

  // Handle email input (only for text messages)
  if (ctx.session.awaitingEmail && ctx.message && "text" in ctx.message) {
    const email = message;
    if (!isValidEmail(email)) {
      await ctx.reply("Please input a valid email.");
      return;
    }

    const telegramId = String(ctx.from?.id ?? "");
    if (!telegramId) return;

    await User.updateOne({ telegramId }, { $set: { email } }, { upsert: true });

    ctx.session.awaitingEmail = false;

    const name = ctx.from?.first_name ?? "";
    await ctx.reply(
      `🎉 Welcome aboard, ${name}!\n\nStart exploring by checking live prices or building your personal watchlist.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔥 Popular tokens", callback_data: "cmd_popular" }],
            [{ text: "👤 Profile", callback_data: "cmd_profile" }],
          ],
        },
      }
    );
  }
});

// Start the bot only after MongoDB is connected
async function startBot() {
  try {
    await connectMongo();
    logger.info("Starting bot...");
    await bot.launch();
    logger.info("Bot is running!");
  } catch (err) {
    logger.error({ err }, "Failed to start bot");
    process.exit(1);
  }
}

startBot();

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
