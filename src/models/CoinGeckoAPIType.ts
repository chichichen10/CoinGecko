/* eslint-disable camelcase */
export interface ApiCoins {
  name: string;
  id: string;
  market_data: {
    current_price: {
      twd: number;
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
  };
}
export interface ApiCoinsMarketChart {
  prices: Array<Array<number>>;
}
export interface ApiCoinsMarket {
  name: string;
  id: string;
  image: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}
