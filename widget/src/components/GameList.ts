/**
 * GameList - Wrapper for list of games
 */

export class GameList extends HTMLElement {
  connectedCallback() {
    this.className = 'game-list';
  }
}

if (!customElements.get('game-list')) {
  customElements.define('game-list', GameList);
}
