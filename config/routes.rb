Rails.application.routes.draw do
  root "activities#index"
  
  get 'activities/filter_group', to: 'activity_filters#new_group'
  get 'activities/filter_condition', to: 'activity_filters#new_condition'
  get '/activities/filter_condition', to: 'activity_filters#filter_condition'
  
  resources :activities
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
