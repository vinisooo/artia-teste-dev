class Activity < ApplicationRecord
  def kind_value
    { 1 => "Melhoria", 2 => "Bug", 3 => "Spike", 4 => "Documentação", 5 => "Reunião" }[self.kind]
  end

  def urgency_value
    { 1 => "Alto", 2 => "Médio", 3 => "Baixo" }[self.urgency]
  end
end
