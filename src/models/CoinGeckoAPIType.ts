/* eslint-disable camelcase */
export interface ApiCoins {
  name: string;
  market_data: {
    current_price: {
      twd: number;
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
  };
  error: string;
}
export interface ApiCoinsMarketChart {
  prices: Array<Array<number>>;
}
