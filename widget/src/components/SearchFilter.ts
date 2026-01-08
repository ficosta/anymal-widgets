/**
 * SearchFilter - Search/filter input component
 */

export class SearchFilter extends HTMLElement {
  connectedCallback() {
    const placeholder = this.dataset.placeholder || 'Search...';
    this.innerHTML = `
      <div class="search-filter">
        <input type="text" class="search-input" placeholder="${placeholder}" />
      </div>
    `;

    const input = this.querySelector('.search-input') as HTMLInputElement;
    input?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.dispatchEvent(new CustomEvent('search-changed', { detail: { query }, bubbles: true }));
    });
  }
}

if (!customElements.get('search-filter')) {
  customElements.define('search-filter', SearchFilter);
}
