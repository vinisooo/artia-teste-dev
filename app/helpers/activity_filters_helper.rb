module ActivityFiltersHelper
  def field_label(field)
    {
      "title" => "Título",
      "description" => "Descrição",
      "status" => "Status",
      "start_date" => "Data de início",
      "end_date" => "Data de término",
      "kind" => "Tipo",
      "completed_percent" => "Percentual concluído",
      "priority" => "Prioridade",
      "urgency" => "Urgência",
      "points" => "Pontos",
      "user" => "Responsável"
    }[field]
  end

  def operator_label(operator)
    {
      "AND" => "E",
      "OR" => "OU"
    }[operator]
  end

  def field_type(field)
    {
      "title" => "text",
      "description" => "text",
      "status" => "select",
      "start_date" => "date",
      "end_date" => "date",
      "kind" => "select",
      "completed_percent" => "number",
      "priority" => "number",
      "urgency" => "select",
      "points" => "number"
      "user" => "select"
    }[field]
  end

  def field_options(field)
    field = field.to_s # garante que é string
  
    {
      "status" => [
        { value: 1, label: "Entregue" },
        { value: 0, label: "Em andamento" }
      ],
      "kind" => [
        { value: 1, label: "Melhoria" },
        { value: 2, label: "Bug" },
        { value: 3, label: "Spike" },
        { value: 4, label: "Documentação" },
        { value: 5, label: "Reunião" }
      ],
      "urgency" => [
        { value: 1, label: "Alto" },
        { value: 2, label: "Médio" },
        { value: 3, label: "Baixo" }
      ]
    }[field]
  end  
end
