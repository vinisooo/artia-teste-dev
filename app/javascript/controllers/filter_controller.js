import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "container", "fieldSelect", "valueWrapper", 
    "inputWrapper", "operatorSelect", "groupOperatorSelect", "groupOperatorDisplay",
    "operatorDisplay"
  ]

  connect() {
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
          display.textContent = select.value === "AND" ? "E" : "Ou"
        }
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
            <option value="AND">E</option>
            <option value="OR">Ou</option>
          </select>
        `
      } else {
        operatorCol.innerHTML = `<p class="m-0 pt-3" data-filter-target="groupOperatorDisplay">E</p>`
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
      .then(html => conditionsContainer.insertAdjacentHTML("beforeend", html))
  }

  removeCondition(event) {
    const conditionsContainer = event.currentTarget.closest(".conditions-container")
    if (conditionsContainer.querySelectorAll(".filter-condition").length > 1) {
      event.currentTarget.closest(".filter-condition").remove()
    } else {
      const group = event.currentTarget.closest(".filter-group")
      const root = group.parentElement
      group.remove()
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
  
    const displays = this.containerTarget.querySelectorAll("[data-filter-target='groupOperatorDisplay']")
    displays.forEach(display => {
      display.textContent = value === "AND" ? "E" : "Ou"
    })
  }
  
  toggleConditionOperator(event) {
    const select = event.target
    const value = select.value

    if (this.hasOperatorDisplayTarget) {
      this.operatorDisplayTarget.textContent = value === "AND" ? "E" : "Ou"
    }
  }
}