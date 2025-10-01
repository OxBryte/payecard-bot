import { Context } from "telegraf";
import { User } from "../models/User";
import { logger } from "../config";

// Profile handler - shows user profile information
export async function profileCommand(ctx: Context) {
  const telegramId = String(ctx.from?.id ?? "");

  if (!telegramId) {
    await ctx.reply("❌ Unable to identify user.");
    return;
  }

  try {
    const user = await User.findOne({ telegramId }).lean();

    if (!user) {
      await ctx.reply("❌ User profile not found.");
      return;
    }

    const message =
      `*Your Profile*\n\n` +
      `Email: ${user.email || "N/A"}\n` +
      `Username: @${user.username || "N/A"}\n` +
      `Joined: ${new Date(user.createdAt).toLocaleDateString()}`;

    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (err) {
    logger.error({ err }, "Failed to fetch profile");
    await ctx.reply("❌ Failed to fetch profile. Please try again later.");
  }
}
