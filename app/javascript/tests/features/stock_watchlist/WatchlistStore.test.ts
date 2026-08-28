import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { WatchlistStore } from '@/features/stock_watchlist/WatchlistStore';

describe('WatchlistStore', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.onGet('/api/v1/stocks/prices').reply(200, {});
    mockAxios.onGet('/api/v1/stocks/search').reply(200, {});
  });

  afterEach(() => {
    mockAxios.reset();
  });

  const makeMockStocks = () => {
    const keys = [];
    for (let i = 0; i <= 40; i++) {
      keys.push(i.toString());
    }
    const mockStocks = {};
    for (const key in keys) {
      mockStocks[key] = { name: '', ticker: key };
    }
    return mockStocks;
  };

  it('adds new stocks to selection', () => {
    const store = new WatchlistStore();
    const testStock1 = { name: 'test', ticker: 'TEST' };
    const testStock2 = { name: 'test2', ticker: 'TEST2' };
    store.addSelectedStock(testStock1);
    store.addSelectedStock(testStock2);
    expect(Object.keys(store.selectedStocks).length).toBe(2);
    expect(store.selectedStocks[testStock1.ticker]).toEqual(testStock1);
    expect(store.selectedStocks[testStock2.ticker]).toEqual(testStock2);
  });

  it('removes stocks from selection', () => {
    const store = new WatchlistStore();
    store.selectedStocks = { TEST: { name: 'test', ticker: 'TEST' } };
    store.removeSelectedStock('TEST');
    expect(store.selectedStocks).toEqual({});
  });

  it('changes the page', () => {
    const store = new WatchlistStore();
    expect(store.page).toEqual(1);
    store.changePage(42);
    expect(store.page).toEqual(42);
  });

  it('goes back a page if the last stock on the last page is removed', () => {
    const store = new WatchlistStore();
    store.selectedStocks = makeMockStocks();
    store.page = 3;
    store.removeSelectedStock('40');
    expect(store.page).toEqual(2);
  });

  it('sets the price change type', () => {
    const store = new WatchlistStore();
    expect(store.priceChangeType).toEqual('amount');
    store.setPriceChangeType('percent');
    expect(store.priceChangeType).toEqual('percent');
  });

  it('updates current page prices', async () => {
    const store = new WatchlistStore();
    store.selectedStocks = { FOO: { name: 'foo', ticker: 'FOO' } };
    mockAxios
      .onGet('/api/v1/stocks/prices')
      .reply(200, { FOO: { price: '1.42', last_close: '0.99' } });
    await store.updatePagePrices();
    expect(store.selectedStocks['FOO']).toEqual({
      name: 'foo',
      ticker: 'FOO',
      price: '1.42',
      last_close: '0.99',
    });
  });

  it('computes the correct page number', () => {
    const store = new WatchlistStore();
    store.selectedStocks = makeMockStocks();
    expect(store.totalPages).toEqual(3);
  });

  it('computes the current page of stocks', () => {
    const store = new WatchlistStore();
    store.selectedStocks = makeMockStocks();
    store.page = 2;
    expect(Object.keys(store.paginatedStocks)).not.toContain('19');
    expect(Object.keys(store.paginatedStocks)).toContain('20');
    expect(Object.keys(store.paginatedStocks)).toContain('39');
    expect(Object.keys(store.paginatedStocks)).not.toContain('40');
  });
});
