import axios, { AxiosResponse } from 'axios';
import { StockPrice, StockTickersAndNames } from '@/shared/types';

export const Api = {
  async search(query: string): Promise<AxiosResponse<StockTickersAndNames>> {
    return await axios.get('/api/v1/stocks/search', {
      params: {
        query: query,
      },
    });
  },
  async getPrices(tickers: string[]): Promise<AxiosResponse<{ [ticker: string]: StockPrice }>> {
    return await axios.get('/api/v1/stocks/prices', {
      params: {
        tickers: tickers,
      },
    });
  },
};
