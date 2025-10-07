# Sistema de Filtros Avançados

## Sobre o Projeto

Implementação de um sistema de filtros avançados para tabelas de atividades seguindo os requisitos especificados. A solução permite criar múltiplos grupos de filtros com operadores lógicos personalizáveis.

## Arquitetura da Solução

### Query Builder

Desenvolvi um query builder que processa estrutura JSON de filtros e traduz para consultas SQL no ActiveRecord.

**Estrutura dos Filtros:**
```json
{
  "operator": "AND",
  "groups": [
    {
      "operator": "OR", 
      "filters": [
        { "field": "user_id", "value": ["3"] },
        { "field": "urgency", "value": ["alta"] }
      ]
    }
  ]
}
```

### Funcionamento do Query Builder

1. Processamento hierárquico de grupos e filtros
2. Suporte a operações AND/OR entre grupos e entre filtros  
3. Tratamento de múltiplos valores por filtro (Infelizmente não tive tempo, porém poderia ser implementado em alterações futuras)
4. Tipagem automática de campos

## Decisões Técnicas

### Foco em JavaScript/Stimulus

Como primeira experiência com Ruby on Rails, optei por utilizar tecnologias que domino para garantir entrega funcional:

- **Stimulus**: Para interatividade complexa no frontend
- **JavaScript**: Manipulação dinâmica do DOM
- **JSON API**: Ponte entre frontend e backend

### Estrutura do Modal

- CRUD dinâmico de grupos e filtros
- Validações (limite de 4 grupos e 4 filtros)
- Operadores sincronizados
- Interface seguindo modelo proposto

## Como Executar

### Docker (Recomendado)

```bash
make docker
```

### Desenvolvimento Local

```bash
bundle install
rails db:create db:migrate db:seed  
rails server
```

## Funcionalidades Implementadas

- Modal de filtros acessível pelo botão "Filtrar"
- Múltiplos grupos (até 4 grupos)
- Filtros por grupo (até 4 filtros) 
- Operadores lógicos AND/OR
- Campos dinâmicos baseados nas colunas
- Validações de limites

A arquitetura permite reutilização do sistema de filtros em outras funcionalidades.

*Desenvolvido como parte do desafio técnico - Artia*