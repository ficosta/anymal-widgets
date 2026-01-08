/**
 * FavoriteStar - Favorite toggle component
 */

export class FavoriteStar extends HTMLElement {
  private isFavorite: boolean = false;

  connectedCallback() {
    this.isFavorite = this.hasAttribute('favorite');
    this.render();
    this.addEventListener('click', () => this.toggle());
  }

  render() {
    this.innerHTML = `
      <button class="favorite-star ${this.isFavorite ? 'active' : ''}" aria-label="Toggle favorite">
        ${this.isFavorite ? '★' : '☆'}
      </button>
    `;
  }

  toggle() {
    this.isFavorite = !this.isFavorite;
    this.render();
    this.dispatchEvent(
      new CustomEvent('favorite-toggled', { detail: { favorite: this.isFavorite }, bubbles: true })
    );
  }
}

if (!customElements.get('favorite-star')) {
  customElements.define('favorite-star', FavoriteStar);
}
