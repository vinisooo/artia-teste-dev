import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["operatorSelect", "operatorDisplay", "container"]

  addCondition(event) {
    const groupElement = event.currentTarget.closest(".filter-group")
    const groupIndex = groupElement.dataset.groupIndex
    const conditionsContainer = groupElement.querySelector(".conditions-container")
    const conditionCount = conditionsContainer.querySelectorAll(".filter-condition").length

    if(conditionCount >= 4) {
      alert('Maximo de 4 filtros agrupados permitidos')
      return
    }

    fetch(`/activities/filter_condition?group_index=${groupIndex}&condition_index=${conditionCount}`)
      .then(response => response.text())
      .then(html => {
        conditionsContainer.insertAdjacentHTML("beforeend", html)
        const conditionsOperator = groupElement.querySelector(`[name="groups[${groupIndex}][operator]"]`)?.value || 'OR'
        this.reindexConditions(groupElement, conditionsOperator)
      })
  }

  removeCondition(event) {
    const groupElement = event.currentTarget.closest(".filter-group")
    const conditionsContainer = groupElement.querySelector(".conditions-container")
    const groupIndex = groupElement.dataset.groupIndex

    const conditionsOperator = groupElement.querySelector(`[name="groups[${groupIndex}][operator]"]`)?.value || 'OR'

    if (conditionsContainer.querySelectorAll(".filter-condition").length > 1) {
      event.currentTarget.closest(".filter-condition").remove()
      this.reindexConditions(groupElement, conditionsOperator)
    } else {
      groupElement.remove()
      document.dispatchEvent(new CustomEvent('group:removed', {
        detail: { groupIndex: groupIndex }
      }))
    }
  }

  reindexConditions(group, operator = 'OR') {
    if(!group) return
    const groupIndex = group.dataset.groupIndex
    const conditions = group.querySelectorAll(".filter-condition")

    conditions.forEach((condition, index) => {
      condition.dataset.conditionIndex = index

      const operatorCol = condition.querySelector(".row > .col:first-child")
      if (!operatorCol) return

      operatorCol.innerHTML = ""

      if (index === 0) {
        operatorCol.innerHTML = `<p>Onde</p>`
      } else if (index === 1) {
        operatorCol.innerHTML = `
          <select
            name="groups[${groupIndex}][operator]"
            class="form-select"
            data-action="change->group#toggleConditionOperator"
            data-group-index="${groupIndex}"
          >
            <option value="AND" ${operator === 'AND' ? 'selected' : ''}>E</option>
            <option value="OR" ${operator === 'OR' ? 'selected' : ''}>Ou</option>
          </select>
        `
      } else {
        operatorCol.innerHTML = `
          <p
            data-filter-target="operatorDisplay"
            data-condition-index="${index}"
            data-group-index="${groupIndex}"
          >${this.getOperatorLabel(operator)}</p>
        `
      }
    })
  }

  toggleConditionOperator(event) {
    const select = event.target
    const groupIndex = select.closest("[data-group-index]")?.dataset.groupIndex
    if (!groupIndex) return

    const groupConditions = document.querySelectorAll(
      `.filter-condition[data-group-index='${groupIndex}'] [data-filter-target='operatorDisplay']`
    )

    groupConditions.forEach(display => {
      display.textContent = select.value === "AND" ? "E" : "Ou"
    })
  }

  getOperatorLabel(operator) {
    return {
      'AND': 'E',
      'OR': 'Ou'
    }[operator] || 'E'
  }
}
