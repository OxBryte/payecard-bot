import { Context } from "telegraf";

// Help hander - this command shows the help message
export async function helpCommand(ctx: Context) {
  const helpMessage =
    `📚 *Available Commands*\n\n` +
    `🔥 /popular - View popular tokens\n` +
    `👤 /profile - View your profile\n` +
    `❓ /help - Show this help message\n\n`;

  await ctx.reply(helpMessage, { parse_mode: "Markdown" });
}
