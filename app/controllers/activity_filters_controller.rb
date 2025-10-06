class ActivityFiltersController < ApplicationController
  # GET /activities/filter_group
  def new_group
    @group_index = params[:index].to_i
    @group_operator = params[:global_operator] || 'AND'
    @group = FilterGroup.new(filters: [FilterCondition.new], operator: 'OR')

    render partial: "activities/filter/filter_group", 
           locals: { 
             group: @group, 
             group_index: @group_index,
             group_operator: @group_operator
           }
  end

  # GET /activities/filter_condition
  def new_condition
    @group_index = params[:group_index].to_i
    @condition_index = params[:condition_index].to_i
    @group = FilterGroup.new(operator: 'OR')
    
    field = params[:field]
    # temp, so pra renderizar o input
    @condition = FilterCondition.new(field: field, value: [])

    render partial: "activities/filter/filter_condition", 
           locals: { 
             condition: @condition, 
             group_index: @group_index, 
             condition_index: @condition_index,
             operator: @group.operator
           }
  end
end
