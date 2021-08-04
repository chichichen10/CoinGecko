/* eslint-disable camelcase */
export interface ApiCoins {
  name: string;
  market_data: {
    current_price: {
      twd: number;
      usd: number;
    };
  };
}
export interface ApiCoinsMarketChart {
  prices: Array<Array<number>>;
}
