class FilterCondition
  include ActiveModel::Model
  attr_accessor :field, :value, :operator

  def initialize(attributes = {})
    attributes = attributes.with_indifferent_access if attributes.respond_to?(:with_indifferent_access)
    @field = attributes[:field] || attributes["field"]
    @value = attributes[:value] || attributes["value"]
    @operator = attributes[:operator] || attributes["operator"]
  end
end
