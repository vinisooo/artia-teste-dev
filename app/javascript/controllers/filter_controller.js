import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "container", "fieldSelect", "valueWrapper", 
    "inputWrapper", "operatorSelect", "groupOperatorSelect", "groupOperatorDisplay",
    "operatorDisplay"
  ]
  groupOperator = 'AND'

  connect() {
  }

  getOperatorLabel(operator) {
    return {
      'AND': 'E',
      'OR': 'Ou'
    }[operator] || 'E'
  }

  addGroup() {
    const groupCount = this.containerTarget.querySelectorAll(".filter-group").length
    if(groupCount >= 4) {
      alert('Maximo de 4 grupos permitidos')
      return
    }
    
    fetch(`/activities/filter_group?index=${groupCount}`)
      .then(response => response.text())
      .then(html => {
        this.containerTarget.insertAdjacentHTML("beforeend", html)

        const newGroup = this.containerTarget.querySelectorAll(".filter-group")[groupCount]
        const select = newGroup.querySelector("[data-filter-target='operatorSelect']")
        const display = newGroup.querySelector("[data-filter-target='operatorDisplay']")

        if (select && display) {
          display.textContent = this.getOperatorLabel(select.value)
        }

        this.reindexGroups(this.containerTarget)
      })
  }

  reindexGroups(root) {
    if (!root) return
  
    const groups = root.querySelectorAll(".filter-group")
    groups.forEach((group, index) => {
      group.dataset.groupIndex = index
      const operatorCol = group.querySelector(".col-2")
      if (!operatorCol) return
  
      operatorCol.innerHTML = ""
      if (index === 0) {
        operatorCol.innerHTML = `<p class="pt-3">Onde</p>`
      } else if (index === 1) {
        operatorCol.innerHTML = `
          <select 
            name="group_operator"
            class="form-select"
            data-action="change->filter#toggleGroupOperator"
            data-filter-target="groupOperatorSelect"
            data-group-index="${index}"
          >
            <option value="AND" ${this.groupOperator === 'AND' ? 'selected' : ''}>E</option>
            <option value="OR" ${this.groupOperator === 'OR' ? 'selected' : ''}>Ou</option>
          </select>
        `
      } else {
        operatorCol.innerHTML = `<p class="m-0 pt-3" style="text-align: center" data-filter-target="groupOperatorDisplay">${this.getOperatorLabel(this.groupOperator)}</p>`
      }
    })
  }

  reindexConditions(group, operator = 'OR') {
    if(!group) return
    const groupIndex = group.dataset.groupIndex
    const conditions = group.querySelectorAll(".filter-condition")
  
      conditions.forEach((condition, index) => {
        condition.dataset.conditionIndex = index
  
        const operatorCol = condition.querySelector(".col")
        if (!operatorCol) return
  
        operatorCol.innerHTML = ""
  
        if (index === 0) {
          operatorCol.innerHTML = `<p>Onde</p>`
        } else if (index === 1) {
          operatorCol.innerHTML = `
            <select 
              name="groups[${groupIndex}][operator]"
              class="form-select"
              data-action="change->filter#toggleConditionOperator"
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
        const conditionsOperator = groupElement.querySelector(`[name="groups[${groupIndex}][operator]"]`)?.value
        this.reindexConditions(groupElement, conditionsOperator)
      })
  }

  removeCondition(event) {
    const groupElement = event.currentTarget.closest(".filter-group")
    const conditionsContainer = groupElement.querySelector(".conditions-container")
    const groupIndex = groupElement.dataset.groupIndex
    const root = groupElement.parentElement

    const conditionsOperator = groupElement.querySelector(`[name="groups[${groupIndex}][operator]"]`)?.value

    if (conditionsContainer.querySelectorAll(".filter-condition").length > 1) {
      event.currentTarget.closest(".filter-condition").remove()
      this.reindexConditions(groupElement, conditionsOperator)
    } else {
      groupElement.remove()
      this.reindexGroups(root)
    }
  }  

  toggleField(event) {
    const selected = event ? event.target.value : this.fieldSelectTarget.value

    this.inputWrapperTargets.forEach(wrapper => {
      if (wrapper.dataset.field === selected) {
        wrapper.classList.remove("d-none")
      } else {
        wrapper.classList.add("d-none")
        const input = wrapper.querySelector("input, select")
        if(input) input.value = ""
      }
    })
  }

  toggleGroupOperator(event) {
    const select = event.target
    const value = select.value

    this.groupOperator = value
    const displays = this.containerTarget.querySelectorAll("[data-filter-target='groupOperatorDisplay']")
    displays.forEach(display => {
      display.textContent = value === "AND" ? "E" : "Ou"
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
}