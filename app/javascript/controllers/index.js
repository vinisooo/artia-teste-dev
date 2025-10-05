// Import and register all your controllers from the importmap under controllers/*

import { application } from "controllers/application"

// Manually import and register controllers
import FilterController from "controllers/filter_controller"

application.register("filter", FilterController)
