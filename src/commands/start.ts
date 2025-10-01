import { User } from "../models/User";
import { BotContext } from "../services/bot/bot.interface";
import { logger } from "../config";
import { checkIsAdmin } from "../middlewares/isAdmin";

// Keyboard for the main menu
function buildMainMenuKeyboard(userId: number) {
  const keyboard = [
    [{ text: "🔥 Popular tokens", callback_data: "cmd_popular" }],
    [{ text: "👤 Profile", callback_data: "cmd_profile" }],
  ];

  // Add broadcast button if the user is ID is in the admin list
  if (checkIsAdmin(userId)) {
    keyboard.push([{ text: "📢 Broadcast", callback_data: "cmd_broadcast" }]);
  }

  return {
    inline_keyboard: keyboard,
  };
}

// Start handler
export async function startCommand(ctx: BotContext) {
  const name = ctx.from?.first_name ?? "";
  const telegramId = String(ctx.from?.id ?? "");

  if (!telegramId) {
    await ctx.reply("❌ Unable to identify user. Please try again.");
    return;
  }

  const username = ctx.from?.username;

  try {
    // Find existing user
    const existingUser = await User.findOne({ telegramId }).lean();

    if (!existingUser) {
      // Create new user
      await User.create({ telegramId, username });
    } else if (username && existingUser.username !== username) {
      // Update username if changed
      await User.updateOne({ telegramId }, { $set: { username } });
    }

    // Check if user has email
    const userDoc = await User.findOne({ telegramId }).lean();
    const hasEmail = Boolean(userDoc?.email);

    // Request email from new users
    if (!hasEmail) {
      ctx.session.awaitingEmail = true;
      await ctx.reply(
        `👋 Welcome to Payecard Bot, ${name}!\n\nTo get started, please provide your email address.`
      );
      return;
    }

    // Show main menu for returning users
    const userId = ctx.from?.id ?? 0;
    await ctx.reply(`👋 Hey ${name}, glad to have you back on Payecard Bot!`, {
      reply_markup: buildMainMenuKeyboard(userId),
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch profile");
    await ctx.reply(
      "❌ Something went wrong. Please try again later or contact support."
    );
  }
}
