/**
 * DatePicker - Date selection component
 */

export class DatePicker extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="date-picker">
        <input type="date" class="date-input" />
      </div>
    `;

    const input = this.querySelector('.date-input') as HTMLInputElement;
    input?.addEventListener('change', (e) => {
      const date = (e.target as HTMLInputElement).value;
      this.dispatchEvent(new CustomEvent('date-changed', { detail: { date }, bubbles: true }));
    });
  }
}

if (!customElements.get('date-picker')) {
  customElements.define('date-picker', DatePicker);
}
