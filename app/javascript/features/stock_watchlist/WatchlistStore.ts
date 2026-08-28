import { makeAutoObservable, runInAction, values } from "mobx";
import {
  SelectedStocks,
  StockInfo,
  Stock,
  PriceChangeType,
} from "@/shared/types";
import { createContext } from "react";
import { Api } from "@/shared/Api";

const STOCK_LOCAL_STORAGE_KEY = "selected_stocks";
const CHANGE_TYPE_LOCAL_STORAGE_KEY = "price_change_type";
// Should probably have this dictated by config from the backend so it can be updated
// without changing code
const PAGE_SIZE = 20;

/**
 * Mobx store to manage application state. Components that use it must be
 * passed to the Mobx `observer` function and can access it through the
 * provided React context hook, or passed in as a prop from a parent component.
 */
export class WatchlistStore {
  /**
   * A list of stocks the current user has selected.
   */
  selectedStocks: { [ticker: string]: Stock } =
    JSON.parse(localStorage.getItem(STOCK_LOCAL_STORAGE_KEY)) || {};

  /**
   * The current page number.
   *
   * App is paginated to reduce the size of set of stocks each update. In this
   * excercise there's only a little more than 100 in the dataset, but in a real
   * setting the dataset might be arbitrarily large. Normally I would paginate on
   * the backend, but the requirements indicate this should, at least primarily,
   * be a React app so it's implemented here
   */
  page: number = 1;

  /**
   * How the price change for each stock should be displayed.
   */
  priceChangeType: PriceChangeType =
    (localStorage.getItem(CHANGE_TYPE_LOCAL_STORAGE_KEY) as PriceChangeType) ||
    "amount";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.updatePagePrices();
    // Potential performance boost: only run this during open trading hours
    setInterval(() => {
      this.updatePagePrices();
    }, 60000);
  }

  /**
   * The current page of stocks being displayed. Calculated from selectedStocks
   * and current page.
   *
   * Computed value.
   */
  get paginatedStocks(): SelectedStocks {
    // https://stackoverflow.com/questions/42761068/paginate-javascript-array
    // https://stackoverflow.com/questions/4215737/how-to-convert-an-array-into-an-object
    const start = (this.page - 1) * PAGE_SIZE;
    const end = this.page * PAGE_SIZE;
    const slice = Object.entries(this.selectedStocks).slice(start, end);
    const paged: SelectedStocks = slice.reduce(
      (acc, values: [string, StockInfo]) => ({
        ...acc,
        [values[0]]: values[1],
      }),
      {},
    );
    return paged;
  }

  /**
   * The total number of pages of selected stocks using a page size of 20.
   *
   * Computed value.
   */
  get totalPages(): number {
    return Math.ceil(Object.keys(this.selectedStocks).length / PAGE_SIZE);
  }

  /**
   * Adds a new stock to the watchlist.
   * @param stock Stock to add to watchlist
   */
  addSelectedStock(stock: Stock) {
    this.selectedStocks[stock.ticker] = stock;
    this.updatePagePrices();
    this.cacheSelectedStocks();
  }

  /**
   * Remove a stock from the watchlist.
   * @param ticker The ticker of the stock to remove from the watchlist
   */
  removeSelectedStock(ticker: string) {
    delete this.selectedStocks[ticker];
    this.cacheSelectedStocks();
    // if we removed the last stock from the last page, set page back 1
    if (Object.keys(this.paginatedStocks).length === 0) {
      this.changePage(this.page - 1);
    }
  }

  /**
   * Saves current selected stocks to storage.
   *
   * Note: in production I would save this to a database so it could be
   * accessed across browsers, but the exercise is supposed to be in React
   * so options are limited.
   */
  cacheSelectedStocks() {
    localStorage.setItem(
      STOCK_LOCAL_STORAGE_KEY,
      JSON.stringify(this.selectedStocks),
    );
  }

  /**
   * Fetches the stock prices for the current page and updates the state.
   */
  async updatePagePrices() {
    const tickers = Object.keys(this.paginatedStocks);
    if (tickers.length > 0) {
      const response = await Api.getPrices(tickers);
      runInAction(() => {
        Object.keys(this.selectedStocks).forEach((ticker) => {
          this.selectedStocks[ticker] = {
            ...this.selectedStocks[ticker],
            ...response.data[ticker],
          };
        });
        this.cacheSelectedStocks();
      });
    }
  }

  /**
   * Changes the current page. Triggers an price update.
   * @param pageNum The page to change to
   */
  changePage(pageNum: number) {
    this.page = pageNum;
    this.updatePagePrices();
  }

  /**
   * Sets the price change type to the given type
   * @param type The price change type to switch to
   */
  setPriceChangeType(type: PriceChangeType) {
    this.priceChangeType = type;
    localStorage.setItem(CHANGE_TYPE_LOCAL_STORAGE_KEY, this.priceChangeType);
  }
}

/**
 * Creates a new WatchlistStore that can be accessed via the useContext hook.
 */
export const WatchlistStoreContext = createContext<WatchlistStore>(
  new WatchlistStore(),
);
