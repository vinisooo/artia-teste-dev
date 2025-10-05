class ActivityFilterBuilder
  def initialize(scope, filters_params)
    @scope = scope
    @filters_params = filters_params || {}
  end

  def apply
    return @scope if @filters_params.blank? || @filters_params[:groups].blank?

    # Monta a expressão completa de todos os grupos
    clauses = []

    @filters_params[:groups].each do |group|
      group_clause = build_group_clause(group)
      next if group_clause.blank?

      # adiciona operador entre grupos se existir
      if group[:operator].present? && clauses.any?
        clauses << group[:operator].upcase
      end

      clauses << "(#{group_clause})"
    end

    where_clause = clauses.join(" ")
    @scope.where(where_clause)
  end

  private

  def build_group_clause(group)
    filters = group[:filters] || []
    return nil if filters.empty?

    clauses = []

    filters.each do |filter|
      next if filter[:field].blank? || filter[:value].blank?

      clause = build_filter_clause(filter)
      next if clause.blank?

      # adiciona operador antes do filtro, se houver (ex: OR urgency = 'alta')
      if filter[:operator].present? && clauses.any?
        clauses << filter[:operator].upcase
      end

      clauses << clause
    end

    clauses.join(" ")
  end

  def build_filter_clause(filter)
    column = ActiveRecord::Base.connection.quote_column_name(filter[:field])
    values = filter[:value].is_a?(Array) ? filter[:value] : [filter[:value]]

    if values.size > 1
      quoted_values = values.map { |v| ActiveRecord::Base.connection.quote(v) }.join(", ")
      "#{column} IN (#{quoted_values})"
    else
      val = ActiveRecord::Base.connection.quote(values.first)
      "#{column} = #{val}"
    end
  end
end
