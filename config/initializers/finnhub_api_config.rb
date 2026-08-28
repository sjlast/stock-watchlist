# frozen_string_literal: true

require 'finnhub_ruby'

FinnhubRuby.configure do |config|
  config.api_key['api_key'] = Rails.application.credentials.finnhub_api_key
end
