import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Autocomplete, TextField, InputAdornment, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { debounce } from 'lodash';
import { Api } from '@/shared/Api';
import { StockInfo } from '@/shared/types';
import { WatchlistStore, WatchlistStoreContext } from './WatchlistStore';
import { blue } from '@mui/material/colors';

interface Props {}

/**
 * Component for searching stocks and adding them to the watchlist.
 */
export const StockSearch = observer((props: Props) => {
  const [value, setValue] = useState<StockInfo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly StockInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const store: WatchlistStore = useContext(WatchlistStoreContext);

  const fetchSearchResults = useCallback(async (query: string) => {
    // Potential speed gain: cache responses based on query
    setLoading(true);
    const response = await Api.search(query);
    const companies: StockInfo[] = Object.entries(response.data).map((comp) => {
      return { ticker: comp[0], name: comp[1] };
    });
    setLoading(false);
    setOptions(companies);
  }, []);

  // Debounce the search API call so we're not hammering it with every keystroke
  const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 200), []);

  const handleInputChange = (event, newValue: string) => {
    if (newValue) {
      setInputValue(newValue);
      debouncedSearch(newValue);
    } else if (newValue === '') {
      setOptions([]);
    }
  };

  // cancel pending debounce invocations on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <Autocomplete
      id="stock-search"
      sx={{ mt: 2, mb: 4, zIndex: '99999' }}
      value={value}
      isOptionEqualToValue={(option, value) => option.ticker === value.ticker}
      getOptionLabel={(option: StockInfo) => `${option.ticker}: ${option.name}`}
      options={options}
      getOptionDisabled={(opt) => !!store.selectedStocks[opt.ticker]}
      filterSelectedOptions
      loading={loading}
      noOptionsText={
        options.length === 0 && inputValue === ''
          ? 'Search for stock ticker or company name'
          : 'No results'
      }
      blurOnSelect={true}
      onInputChange={handleInputChange}
      onChange={(event, value: StockInfo, reason) => {
        event.preventDefault();
        if (reason === 'selectOption') {
          store.addSelectedStock(value);
        }
      }}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Box display="flex" flexDirection="row">
              <AddCircleIcon sx={{ mr: '0.5rem' }} color="primary" />
              <Typography>{`${option.ticker}: ${option.name}`}</Typography>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Search"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                </>
              ),
            }}
          />
        );
      }}
    />
  );
});
