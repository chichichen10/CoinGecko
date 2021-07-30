export interface API_Coins {
    name: string;
    market_data: {
        current_price: {
            twd: number;
            usd: number;
        }
    };
}
export interface API_Coins_MarketChart {
    prices: Array<Array<number>>;
}