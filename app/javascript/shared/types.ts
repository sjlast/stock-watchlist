export interface StockInfo {
  name: string;
  ticker?: string;
}

/**
 * Company keyed by ticker for fast referencing
 */
export type SelectedStocks = {
  [key: string]: StockInfo;
};

/**
 * Object whose keys are stock tickers
 * and values are stock names
 */
export interface StockTickersAndNames {
  [ticker: string]: string;
}

export interface StockPrice {
  price: number;
  last_close: number;
}

export interface Stock extends StockInfo, Partial<StockPrice> {}

export type PriceChangeType = 'amount' | 'percent';
