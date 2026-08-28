import React, { memo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Stock, PriceChangeType } from "@/shared/types";

interface Props {
  stock: Stock;
  displayChangeAs: PriceChangeType;
  onRemove: (ticker: string) => void;
}

/**
 * Component to display stock information, including ticker, name,
 * current price, and last close price. Displays as green when the
 * current price is greater than or equal to the last price, red
 * otherwise.
 *
 * Memoized to prevent needless re-renders.
 */
export const StockCard = memo(function StockCard(props: Props) {
  const getCurrency = () => {
    // For now only supporting US dollar
    return props.displayChangeAs === "amount" ? "$" : "";
  };

  const calculateChange = () => {
    const { price, last_close } = props.stock;
    let result;
    if (price === null || last_close === null) {
      // error fetching price from API
      result = <i>Error</i>;
    } else if (price && last_close) {
      let change = price - last_close;
      if (props.displayChangeAs === "percent") {
        change = (change / last_close) * 100;
      }

      const prefix = change > 0 ? "+" : "-";
      const postfix = props.displayChangeAs === "percent" ? "%" : "";

      result = `${prefix} ${getCurrency()}${Math.abs(change).toFixed(2).toString()}${postfix}`;
    } else {
      result = <i>Loading...</i>;
    }
    return result;
  };

  const isPriceUp = () => {
    return props.stock.price > props.stock.last_close;
  };

  const formatPrice = (price: number) => {
    let result;
    if (price === undefined) {
      // price has not been fetched yet
      result = <i>Loading...</i>;
    } else if (price === null) {
      // price was not returned from the API, error case
      result = <i>Error loading price</i>;
    } else {
      result = `$${price}`;
    }
    return result;
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 6,
          border: "1px grey solid",
          width: "17rem",
        }}
      >
        <CardHeader
          sx={{
            // https://stackoverflow.com/questions/61675880/react-material-ui-cardheader-title-overflow-with-dots
            display: "flex",
            overflow: "hidden",
            "& .MuiCardHeader-content": {
              overflow: "hidden",
            },
          }}
          action={
            <IconButton onClick={() => props.onRemove(props.stock.ticker)}>
              <CloseIcon />
            </IconButton>
          }
          title={props.stock.ticker}
          subheader={props.stock.name}
          subheaderTypographyProps={{ noWrap: true }}
        />
        <CardContent>
          <Typography>
            <b>Current: </b>{" "}
            {props.stock.hasOwnProperty("price") ? (
              formatPrice(props.stock.price)
            ) : (
              <i>Missing</i>
            )}
          </Typography>
          <Typography>
            <b>Last close: </b>
            {formatPrice(props.stock.last_close)}
          </Typography>
          <Box>
            <Chip
              label={calculateChange()}
              color={isPriceUp() ? "success" : "error"}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
});
