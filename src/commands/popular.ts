import { Context } from "telegraf";
import { getPopularTokens } from "../services/tokens/tokenServices";
import { logger } from "../config";

// Populer handler - shows popular tokens with prices
export async function popularCommand(ctx: Context) {
  try {
    const tokens = await getPopularTokens();

    let message = "🔥 *Popular Tokens*\n\n";

    tokens.forEach((token) => {
      const changeIcon = token.change24h >= 0 ? "📈" : "📉";
      const changeText =
        token.change24h >= 0
          ? `+${token.change24h.toFixed(2)}%`
          : `${token.change24h.toFixed(2)}%`;

      message += `*${token.name}* (${token.symbol})\n`;
      message += `💵 $${token.price.toLocaleString()} ${changeIcon} ${changeText}\n\n`;
    });

    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (err) {
    logger.error({ err }, "Failed to fetch popular tokens");
    await ctx.reply("❌ Failed to fetch token prices. Please try again later.");
  }
}
