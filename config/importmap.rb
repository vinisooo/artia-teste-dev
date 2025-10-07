# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

# Pin controllers
pin "controllers/application", to: "controllers/application.js"
pin "controllers/index", to: "controllers/index.js"
pin "controllers/filter_controller", to: "controllers/filter_controller.js"
pin "controllers/group_controller", to: "controllers/group_controller.js"
pin "controllers/condition_controller", to: "controllers/condition_controller.js"
