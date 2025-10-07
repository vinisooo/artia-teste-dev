import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fieldSelect", "valueWrapper", "inputWrapper", "operatorSelect"]

  connect() {
    this.initWithValues()
  }

  initWithValues() {
    const fieldSelect = this.fieldSelectTarget
    if (fieldSelect && fieldSelect.value) {
      this.toggleField()
    }
  }

  toggleField(event) {
    const selected = event ? event.target.value : this.fieldSelectTarget?.value

    if (!selected) return

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

  toggleConditionOperator(event) {
    const select = event.target
    const groupIndex = select.closest("[data-group-index]")?.dataset.groupIndex
    if (!groupIndex) return

    const groupConditions = document.querySelectorAll(
      `.filter-condition[data-group-index='${groupIndex}'] [data-condition-target='operatorDisplay']`
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
