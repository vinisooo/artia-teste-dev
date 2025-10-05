class ActivityFilter
  include ActiveModel::Model
  attr_accessor :groups, :operator

  validates :groups, :operator, length: { maximum: 4 }

  def initialize(groups, operator)
    @groups = groups.map { |g| FilterGroup.new(g) }
    @operator = operator
  end

  def valid?
    super && groups.all?(&:valid?)
  end
end
