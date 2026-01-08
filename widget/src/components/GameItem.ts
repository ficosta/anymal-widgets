/**
 * GameItem - Individual game/match card
 */

export class GameItem extends HTMLElement {
  public game?: any;

  connectedCallback() {
    this.render();
    this.addEventListener('click', () => this.handleClick());
  }

  render() {
    if (!this.game) {
      this.innerHTML = '<div class="loading">Loading...</div>';
      return;
    }

    const { homeTeam, awayTeam, score, status } = this.game;

    this.innerHTML = `
      <div class="game-item">
        <div class="game-time">${this.formatGameTime()}</div>
        <div class="game-teams">
          <div class="team home-team">
            ${homeTeam.logo ? `<img src="${homeTeam.logo}" class="team-logo" alt="${homeTeam.name}">` : ''}
            <span class="team-name">${homeTeam.name}</span>
            <span class="team-score">${score?.home ?? '-'}</span>
          </div>
          <div class="team away-team">
            ${awayTeam.logo ? `<img src="${awayTeam.logo}" class="team-logo" alt="${awayTeam.name}">` : ''}
            <span class="team-name">${awayTeam.name}</span>
            <span class="team-score">${score?.away ?? '-'}</span>
          </div>
        </div>
        <div class="game-status status-${this.getStatusClass()}">${status?.short || 'NS'}</div>
      </div>
    `;
  }

  formatGameTime(): string {
    if (!this.game) return '';
    const date = new Date(this.game.date);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(): string {
    const status = this.game?.status?.short?.toLowerCase();
    if (status === 'live' || status === '1h' || status === '2h') return 'live';
    if (status === 'ft' || status === 'aet') return 'finished';
    return 'scheduled';
  }

  handleClick() {
    const event = new CustomEvent('game-selected', {
      detail: { game: this.game },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

if (!customElements.get('game-item')) {
  customElements.define('game-item', GameItem);
}
