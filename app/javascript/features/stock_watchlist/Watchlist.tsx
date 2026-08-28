import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Box,
  Typography,
  Pagination,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { CspNonceCache } from '@/shared/components/CspNonceCache';
import { StockSearch } from './StockSearch';
import { Flex } from '@/shared/components/utility';
import { PriceChangeType } from '@/shared/types';
import { StockGrid } from './StockGrid';
import { WatchlistStore, WatchlistStoreContext } from './WatchlistStore';

const theme = createTheme({});

/**
 * Top component for Stock Watchlist app. Applies theme, CSP nonce,
 * and contents of app.
 */
export const Watchlist = observer(() => {
  const store: WatchlistStore = useContext(WatchlistStoreContext);

  return (
    <CspNonceCache>
      <ThemeProvider theme={theme}>
        <Container>
          <Box
            component="header"
            sx={{
              position: 'sticky',
              top: 0,
              borderBottom: '1px grey solid',
              zIndex: '999',
              background: 'white',
              margin: '0 -1rem',
              padding: '0 1rem',
            }}
          >
            <Flex justifyContent="center">
              <Typography variant="h1">Stocks</Typography>
            </Flex>
            <StockSearch />
          </Box>
          {store.totalPages > 0 && (
            <>
              <PriceChangeToggle />
              <StockGrid />
              <Flex justifyContent="center" sx={{ mt: 4 }}>
                <Pagination
                  color="primary"
                  count={store.totalPages}
                  onChange={(event, page: number) => store.changePage(page)}
                />
              </Flex>
            </>
          )}
        </Container>
      </ThemeProvider>
    </CspNonceCache>
  );
});

const PriceChangeToggle = observer(() => {
  const store: WatchlistStore = useContext(WatchlistStoreContext);

  return (
    <>
      <Flex justifyContent="end">
        <FormControl>
          <FormLabel id="display-change-as-controls">Display Price Change As</FormLabel>
          <RadioGroup
            row
            aria-labelledby="display-change-as-controls"
            value={store.priceChangeType}
            onChange={(event) =>
              store.setPriceChangeType((event.target as HTMLInputElement).value as PriceChangeType)
            }
          >
            <FormControlLabel value="amount" control={<Radio />} label="Amount" />
            <FormControlLabel value="percent" control={<Radio />} label="Percent" />
          </RadioGroup>
        </FormControl>
      </Flex>
    </>
  );
});
