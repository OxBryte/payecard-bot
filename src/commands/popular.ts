import { Context } from "telegraf";
import { getPopularTokens } from "../services/tokens/tokenServices";
import { logger } from "../config";

// Escape special characters for MarkdownV2
function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

// Popular handler - shows top tokens by market cap with prices
export async function popularCommand(ctx: Context) {
  try {
    const tokens = await getPopularTokens();

    let message = "🔥 *Top 10 Tokens by Market Cap*\n\n";

    tokens.forEach((token) => {
      const changeIcon = token.change24h >= 0 ? "📈" : "📉";
      const changeText =
        token.change24h >= 0
          ? `+${token.change24h.toFixed(2)}%`
          : `${token.change24h.toFixed(2)}%`;

      // Escape special characters for MarkdownV2
      const escapedName = escapeMarkdownV2(token.name);
      const escapedSymbol = escapeMarkdownV2(token.symbol);
      const escapedPrice = escapeMarkdownV2(token.price.toLocaleString());
      const escapedChange = escapeMarkdownV2(changeText);

      message += `${token.rank}\\. *${escapedName}* \\(${escapedSymbol}\\)\n`;
      message += `💵 $${escapedPrice} ${changeIcon} ${escapedChange}\n\n`;
    });

    await ctx.reply(message, { parse_mode: "MarkdownV2" });
  } catch (err: any) {
    logger.error({ err }, "Failed to fetch popular tokens");

    // Show specific error message if available
    const errorMessage = err?.message?.includes("rate limit")
      ? "⚠️ CoinGecko API rate limit reached. Please wait a moment and try again."
      : "❌ Failed to fetch token prices. Please try again later.";

    await ctx.reply(errorMessage);
  }
}
