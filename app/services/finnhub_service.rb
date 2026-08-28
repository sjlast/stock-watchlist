# frozen_string_literal: true

require 'finnhub_ruby'

class FinnhubService
  # @param symbol_array [Array<String>]
  def get_prices(symbol_array)
    res = {}
    # don't have access to a free bulk quote endpoint so
    # have to query one by one =(
    symbol_array.each do |symbol|
      sym_res = client.quote(symbol)
      res[symbol] = {
        price: sym_res['c'],
        last_close: sym_res['pc'],
        change: sym_res['d'],
        percent_change: sym_res['dp']
      }
    end
    res
  end

  private

  def client
    @client ||= FinnhubRuby::DefaultApi.new
  end
end
