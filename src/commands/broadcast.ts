import { BotContext } from "../services/bot/bot.interface";
import { User } from "../models/User";
import { logger } from "../config";
import { checkIsAdmin } from "../middlewares/isAdmin";

// Broadcast handler - prompts admin to send message
export async function broadcastCommand(ctx: BotContext) {
  const userId = ctx.from?.id;

  // Check if user is admin
  if (!userId || !checkIsAdmin(userId)) {
    await ctx.reply("⛔️ This feature is for admins only.");
    return;
  }

  // Set session to await broadcast message
  ctx.session.awaitingBroadcast = true;

  await ctx.reply(
    "📢 *Broadcast Message*\n\nPlease send the message you want to broadcast to all users.\n\nYou can send:\n• Text messages\n• Photos with captions\n• Videos\n• Documents\n\nSend /cancel to cancel.",
    { parse_mode: "Markdown" }
  );
}

// Send broadcast message to all users (supports text, images, videos, etc.)
export async function sendBroadcast(ctx: BotContext) {
  const userId = ctx.from?.id;

  // Double check admin status
  if (!userId || !checkIsAdmin(userId)) {
    await ctx.reply("⛔️ This feature is for admins only.");
    return;
  }

  try {
    // Get all users from database
    const users = await User.find({}).lean();

    if (users.length === 0) {
      await ctx.reply("❌ No users found in the database.");
      return;
    }

    await ctx.reply(`📤 Sending broadcast to ${users.length} users...`);

    let successCount = 0;
    let failCount = 0;

    const messageId = ctx.message?.message_id;
    const fromChatId = ctx.chat?.id;

    if (!messageId || !fromChatId) {
      await ctx.reply("❌ Failed to get message information.");
      return;
    }

    // Send message to each user using copyMessage (supports all message types)
    for (const user of users) {
      try {
        await ctx.telegram.copyMessage(user.telegramId, fromChatId, messageId, {
          parse_mode: "Markdown",
        });
        successCount++;
      } catch (err) {
        logger.error(
          { err, userId: user.telegramId },
          "Failed to send broadcast to user"
        );
        failCount++;
      }
    }

    // Send summary
    await ctx.reply(
      `✅ *Broadcast Complete!*\n\n` +
        `✔️ Sent: ${successCount}\n` +
        `❌ Failed: ${failCount}\n` +
        `📊 Total: ${users.length}`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    logger.error({ err }, "Failed to send broadcast");
    await ctx.reply("❌ Failed to send broadcast. Please try again later.");
  }
}
