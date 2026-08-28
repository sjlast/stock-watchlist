import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Grid from '@mui/material/Unstable_Grid2';
import { StockCard } from './StockCard';
import { WatchlistStore, WatchlistStoreContext } from './WatchlistStore';

/**
 * Responsive grid layout for selected stocks.
 */
export const StockGrid = observer(({}) => {
  const store: WatchlistStore = useContext(WatchlistStoreContext);

  return (
    <>
      <Grid container spacing={2} columns={{ xs: 1, sm: 4, md: 8 }}>
        {Object.entries(store.paginatedStocks).map(([ticker, stock]) => {
          return (
            <Grid key={ticker} xs={2} display="flex" justifyContent="center" alignItems="center">
              <StockCard
                key={ticker}
                stock={stock}
                displayChangeAs={store.priceChangeType}
                onRemove={store.removeSelectedStock}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
});
