class ActivityFilterBuilder
  def initialize(scope, filters_params)
    @scope = scope
    @filters_params = filters_params.is_a?(String) ? JSON.parse(filters_params) : filters_params
    @filters_params = @filters_params.with_indifferent_access if @filters_params
  end

  def apply
    return @scope if @filters_params.blank? || @filters_params['groups'].blank?

    group_operator = (@filters_params['operator'] || 'AND').upcase
    groups = @filters_params['groups']

    group_conditions = groups.map { |group| build_group_clause(group) }.compact

    return @scope if group_conditions.empty?

    combined_condition = group_conditions.join(" #{group_operator} ")
    
    @scope.where(combined_condition)
  end

  private

  def build_group_clause(group)
    filters = group['filters'] || []
    return nil if filters.empty?

    condition_operator = (group['operator'] || 'AND').upcase
    filter_conditions = filters.map { |filter| build_filter_clause(filter) }.compact

    return nil if filter_conditions.empty?

    "(#{filter_conditions.join(" #{condition_operator} ")})"
  end

  def build_filter_clause(filter)
    field = filter['field']
    values = Array.wrap(filter['value']).reject(&:blank?)
    return nil if field.blank? || values.empty?

    column = ActiveRecord::Base.connection.quote_column_name(field)
    
    # NUMERICO
    if numeric_field?(field)
      numeric_values = values.map(&:to_i)
      if numeric_values.size > 1
        "#{column} IN (#{numeric_values.join(', ')})"
      else
        "#{column} = #{numeric_values.first}"
      end
    else
      # STRING
      quoted_values = values.map { |v| ActiveRecord::Base.connection.quote(v) }
      if quoted_values.size > 1
        "#{column} IN (#{quoted_values.join(', ')})"
      else
        "#{column} = #{quoted_values.first}"
      end
    end
  end

  def numeric_field?(field)
    # Adapte conforme suas colunas numéricas
    %w[id user_id assigned_to_id].include?(field)
  end
end