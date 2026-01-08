/**
 * LeaguesComponent - List of available leagues
 */

export class LeaguesComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="leagues-component">
        <h3>Leagues</h3>
        <div class="leagues-list">
          <p>Loading leagues...</p>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('leagues-component')) {
  customElements.define('leagues-component', LeaguesComponent);
}
