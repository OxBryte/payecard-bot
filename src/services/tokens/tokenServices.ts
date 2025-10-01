import fetch from "node-fetch";
import { CONFIG } from "../../config";
import { SimplePriceResponse } from "./token.interface";

// Popular token mapping (symbol to CoinGecko ID)
export const POPULAR_TOKENS: Record<string, { id: string; name: string }> = {
  btc: { id: "bitcoin", name: "Bitcoin" },
  eth: { id: "ethereum", name: "Ethereum" },
  sol: { id: "solana", name: "Solana" },
  usdt: { id: "tether", name: "Tether" },
  bnb: { id: "binancecoin", name: "BNB" },
  xrp: { id: "ripple", name: "XRP" },
  usdc: { id: "usd-coin", name: "USD Coin" },
  ada: { id: "cardano", name: "Cardano" },
  doge: { id: "dogecoin", name: "Dogecoin" },
  avax: { id: "avalanche-2", name: "Avalanche" },
};

/**
 * Get price for a single token by symbol or CoinGecko ID
 */
export async function getPrice(symbolOrId: string) {
  const symbol = symbolOrId.toLowerCase();
  const coinId = POPULAR_TOKENS[symbol]?.id || symbol;

  const url = `${CONFIG.COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = (await res.json()) as SimplePriceResponse;
  const priceData = json[coinId];

  if (!priceData || typeof priceData.usd !== "number") {
    throw new Error(`Token "${symbolOrId}" not found`);
  }

  return {
    id: coinId,
    symbol: symbol.toUpperCase(),
    name: POPULAR_TOKENS[symbol]?.name || coinId,
    price: priceData.usd,
    change24h: priceData.usd_24h_change || 0,
  };
}

/**
 * Get prices for multiple tokens at once
 */
export async function getPrices(symbolsOrIds: string[]) {
  const coinIds = symbolsOrIds.map((s) => {
    const symbol = s.toLowerCase();
    return POPULAR_TOKENS[symbol]?.id || symbol;
  });

  const url = `${CONFIG.COINGECKO_BASE}/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = (await res.json()) as SimplePriceResponse;

  return Object.entries(json).map(([coinId, data]) => {
    const tokenEntry = Object.entries(POPULAR_TOKENS).find(
      ([, value]) => value.id === coinId
    );
    const symbol = tokenEntry ? tokenEntry[0] : coinId;

    return {
      id: coinId,
      symbol: symbol.toUpperCase(),
      name: POPULAR_TOKENS[symbol]?.name || coinId,
      price: data.usd,
      change24h: data.usd_24h_change || 0,
    };
  });
}

/**
 * Get trending tokens
 */
export async function getTrendingTokens() {
  const url = `${CONFIG.COINGECKO_BASE}/search/trending`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = (await res.json()) as any;

  return json.coins.slice(0, 10).map((item: any) => ({
    id: item.item.id,
    symbol: item.item.symbol.toUpperCase(),
    name: item.item.name,
    rank: item.item.market_cap_rank,
  }));
}

/**
 * Get popular tokens with current prices
 */
export async function getPopularTokens() {
  const popularSymbols = ["btc", "eth", "sol", "usdt", "bnb"];
  return getPrices(popularSymbols);
}

/**
 * Search for a token by name or symbol
 */
export async function searchToken(query: string) {
  const url = `${CONFIG.COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = (await res.json()) as any;

  return json.coins.slice(0, 5).map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    rank: coin.market_cap_rank,
  }));
}
