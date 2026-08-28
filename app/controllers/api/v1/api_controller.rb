# frozen_string_literal: true

module Api
  module V1
    class ApiController < ApplicationController
      before_action :authenticate_user

      private

      def authenticate_user
        # User auth is outside the scope of this project
      end

      def fmp
        @fmp = FinancialModelingPrepService.new
      end

      def finnhub
        @finnhub = FinnhubService.new
      end
    end
  end
end
