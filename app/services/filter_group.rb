class FilterGroup
  include ActiveModel::Model
  attr_accessor :filters, :operator

  validates :filters, length: { maximum: 4 }

  def initialize(attributes = {})
    attributes = attributes.with_indifferent_access if attributes.respond_to?(:with_indifferent_access)
    @operator = attributes[:operator] || attributes["operator"]
    @filters = if attributes[:filters].is_a?(Array)
                 attributes[:filters].map { |f| f.is_a?(FilterCondition) ? f : FilterCondition.new(f) }
               else
                 []
               end
  end

  def valid?
    super && filters.all?(&:valid?)
  end
end