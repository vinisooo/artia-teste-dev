# Executar o projeto

```bash
make docker
```

## Desenvolvimento

A ideia adotada para esta implementacao, foi criar um query builder usando como possiveis filtros colunas atualmente renderizadas na tabela.
De forma abstrata, essa seria a estrutura de filtros:

```json
{
  operator: "AND", # operador entre grupos
  groups: [
    {
      operator: "OR", # operador entre filtros
      filters: [
        { 
          field: "user_id",  
          value: ["3"] # O valor em array, pois ha casos em que podem ser mais de um valor
        },
        { 
          field: "urgency",  
          value: ["alta"] 
        }
      ]
    },
    {
      filters: [
        { field: "type", value: ["manutenção"] }
      ]
    }
  ]
}

```