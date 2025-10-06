class ActivitiesController < ApplicationController
  include ActivityFiltersHelper
  before_action :set_activity, only: %i[ show edit update destroy ]

  # GET /activities or /activities.json
  def index
    @activities = Activity.all.order(:start_date)
    @filters = { operator: 'AND', groups: [] }
    
    begin
      if params[:groups].present?
        groups = params.require(:groups).values.map do |group_params|
          {
            operator: group_params[:operator] || 'AND',
            filters: (group_params[:filters] || {}).values.map do |filter_params|
              {
                field: filter_params[:field],
                value: Array(filter_params[:value]).reject(&:blank?)
              }
            end
          }
        end
        @filters[:groups] = groups
      elsif params[:filters].present?
        @filters = params.require(:filters).permit(
          :operator,
          groups: [
            :operator,
            { filters: [:field, { value: [] }] }
          ]
        ).to_h.deep_symbolize_keys
      end
    rescue => e
      Rails.logger.error "Erro ao montar filtros: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end

    if @filters[:groups].present? && @filters[:groups].any? { |g| g[:filters].present? }
      @activities = ActivityFilterBuilder.new(@activities, @filters).apply
    end

    @filter_groups = if @filters[:groups].present? && @filters[:groups].any? { |g| g[:filters].present? }
      @filters[:operator] = @filters[:operator] || 'AND'
      @filters[:groups].map do |group|
        FilterGroup.new(
          operator: group[:operator] || 'AND',
          filters: group[:filters].map do |filter|
            FilterCondition.new(
              field: filter[:field],
              value: filter[:value]
            )
          end
        )
      end
    else
      [FilterGroup.new(filters: [FilterCondition.new], operator: 'AND')]
    end
  end  

  # GET /activities/1 or /activities/1.json
  def show
  end

  # GET /activities/new
  def new
    @activity = Activity.new
  end

  # GET /activities/1/edit
  def edit
  end

  # POST /activities or /activities.json
  def create
    @activity = Activity.new(activity_params)

    respond_to do |format|
      if @activity.save
        format.html { redirect_to @activity, notice: "Activity was successfully created." }
        format.json { render :show, status: :created, location: @activity }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @activity.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /activities/1 or /activities/1.json
  def update
    respond_to do |format|
      if @activity.update(activity_params)
        format.html { redirect_to @activity, notice: "Activity was successfully updated." }
        format.json { render :show, status: :ok, location: @activity }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @activity.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /activities/1 or /activities/1.json
  def destroy
    @activity.destroy!

    respond_to do |format|
      format.html { redirect_to activities_path, status: :see_other, notice: "Activity was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      @activity = Activity.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def activity_params
      params.expect(activity: [ :title, :description, :status, :start_date, :end_date, :kind, :completed_percent, :priority, :urgency, :points ])
    end
end
