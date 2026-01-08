/**
 * SelectComponent - Custom select dropdown
 */

export class SelectComponent extends HTMLElement {
  connectedCallback() {
    const options = Array.from(this.querySelectorAll('option'));
    const value = this.dataset.value || '';

    this.innerHTML = `
      <div class="select-component">
        <select class="select-input">
          ${options.map((opt) => `<option value="${opt.value}">${opt.textContent}</option>`).join('')}
        </select>
      </div>
    `;

    const select = this.querySelector('.select-input') as HTMLSelectElement;
    if (select && value) {
      select.value = value;
    }

    select?.addEventListener('change', (e) => {
      const selectedValue = (e.target as HTMLSelectElement).value;
      this.dispatchEvent(
        new CustomEvent('selection-changed', { detail: { value: selectedValue }, bubbles: true })
      );
    });
  }
}

if (!customElements.get('select-component')) {
  customElements.define('select-component', SelectComponent);
}
