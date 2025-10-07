import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "groupOperatorSelect", "groupOperatorDisplay"]
  groupOperator = 'AND'

  connect() {
    document.addEventListener('group:removed', this.handleGroupRemoved.bind(this))
    this.reindexGroups(this.containerTarget)
  }

  handleGroupRemoved(event) {
    this.reindexGroups(this.containerTarget)
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
    
    fetch(`/activities/filter_group?index=${groupCount}&global_operator=${this.groupOperator}`)
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

  toggleGroupOperator(event) {
    const select = event.target
    const value = select.value

    this.groupOperator = value
    const displays = this.containerTarget.querySelectorAll("[data-filter-target='groupOperatorDisplay']")
    displays.forEach(display => {
      display.textContent = value === "AND" ? "E" : "Ou"
    })

    const hiddenField = document.querySelector('input[name="filters[operator]"]')
    if (hiddenField) {
      hiddenField.value = value
    }
  }

  clearFilters() {
    this.containerTarget.querySelectorAll('.filter-group').forEach(group => group.remove())
    this.addGroup()
  }
}