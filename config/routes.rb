Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "launch#index"

  # API paths
  namespace :api do
    namespace :v1 do
      resources :stocks, only: [] do
        get :search, action: 'search', on: :collection
        get :prices, action: 'prices', on: :collection
      end
    end
  end

end
