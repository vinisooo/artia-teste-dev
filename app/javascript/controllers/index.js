// Import and register all your controllers from the importmap under controllers/*

import { application } from "controllers/application"

// Manually import and register controllers
import FilterController from "controllers/filter_controller"
import GroupController from "controllers/group_controller"
import ConditionController from "controllers/condition_controller"

application.register("filter", FilterController)
application.register("group", GroupController)
application.register("condition", ConditionController)
