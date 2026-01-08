/**
 * PlayerDetail - Detailed player information
 */

export class PlayerDetail extends HTMLElement {
  connectedCallback() {
    const playerId = this.dataset.playerId;
    this.innerHTML = `
      <div class="player-detail">
        <h3>Player Detail</h3>
        <p>Player ID: ${playerId}</p>
      </div>
    `;
  }
}

if (!customElements.get('player-detail')) {
  customElements.define('player-detail', PlayerDetail);
}
