# frozen_string_literal: true

# This class serves as an adapter for the FMP API, formatting
# the response into the same format used by the original company's API
class FinancialModelingPrepService

  def search_symbol(query)
    res = api.search_symbol(query)
    result = {}
    res.each do |h|
      h = h.with_indifferent_access
      result[h[:symbol]] = h[:name]
    end
    result
  end

  private

  def api
    @api ||= FinancialModelingPrepApi::V1::Client.new
  end
end
