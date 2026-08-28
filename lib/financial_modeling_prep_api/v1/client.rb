# frozen_string_literal: true

require 'faraday'

module FinancialModelingPrepApi::V1
  class Client
    def initialize
      @api_key = Rails.application.credentials.financialmodelingprep_api_key
    end

    def search_symbol(query = '')
      response = connection.get("/stable/search-symbol", { query: query, exchange: :NASDAQ.to_s })
      JSON.parse(response.body)
    end

    private

    # Returns a connection to the Financial Modeling Prep API. Subsequent calls get the same connection.
    def connection
      @connection ||= Faraday.new({
                                    url: 'https://financialmodelingprep.com',
                                    headers: { 'apikey' => @api_key }
                                  }) do |faraday|
        faraday.response :raise_error, include_request: true
      end
    end
  end
end
