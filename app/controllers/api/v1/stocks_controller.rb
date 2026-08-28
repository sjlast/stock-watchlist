# frozen_string_literal: true

module Api
  module V1
    # API endpoints for stocks
    class StocksController < Api::V1::ApiController

      # Performs search against an external financial data APIs
      #
      # @param query [String] The query to pass to the API
      def search
        res = fmp.search_symbol(params[:query])
        render status: :ok, json: res
      end

      # Fetches prices for the given tickers using external financial data APIs
      #
      # @param tickers [String[]] The tickers to fetch stock prices for
      def prices
        res = finnhub.get_prices(params[:tickers])
        render status: :ok, json: res
      end
    end
  end
end
