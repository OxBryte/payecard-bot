import fetch from "node-fetch";
import { CONFIG, logger } from "../../config";

// Get top popular tokens by market cap from CoinGecko
export async function getPopularTokens() {
  try {
    const url = `${CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "TelegramBot/1.0",
      },
    });

    logger.info({ status: res.status }, "CoinGecko response status");

    if (!res.ok) {
      const errorText = await res.text();
      logger.error(
        { status: res.status, error: errorText },
        "CoinGecko API error"
      );

      // Check for rate limiting
      if (res.status === 429) {
        throw new Error(
          "CoinGecko API rate limit exceeded. Please try again in a few moments."
        );
      }

      throw new Error(`CoinGecko API error: ${res.status}`);
    }

    const json = (await res.json()) as any[];

    if (!json || json.length === 0) {
      throw new Error("No tokens returned from CoinGecko API");
    }

    return json.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price || 0,
      change24h:
        coin.price_change_percentage_24h_in_currency ||
        coin.price_change_percentage_24h ||
        0,
      marketCap: coin.market_cap || 0,
      rank: coin.market_cap_rank || 0,
    }));
  } catch (error) {
    logger.error({ error }, "Error in getPopularTokens");
    throw error;
  }
}
