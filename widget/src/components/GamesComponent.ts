/**
 * GamesComponent - Displays list of games/matches/races/fights
 * Supports all sports with filtering and date navigation
 */

import type { AnymalWidget } from './AnymalWidget.js';
import { showLoading } from '../utils/dom.js';
import { translate } from '../utils/i18n.js';
import { fetchGames } from '../utils/api.js';

export class GamesComponent extends HTMLElement {
  private games: any[] = [];
  private filteredGames: any[] = [];
  private currentFilter: 'all' | 'live' | 'finished' | 'scheduled' = 'all';
  private currentDate?: string;
  private widget!: AnymalWidget;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.widget = this.closest('anymal-widget') as AnymalWidget;
    if (!this.widget) {
      console.error('GamesComponent must be inside anymal-widget');
      return;
    }

    this.currentDate = this.dataset.date || this.widget.dataset.date || new Date().toISOString().split('T')[0];
    await this.render();
    await this.loadGames();
  }

  async render() {
    const showToolbar = this.widget.dataset.showToolbar === 'true';
    const showFilters = this.widget.dataset.showFilters === 'true';

    this.innerHTML = `
      <div class="games-component">
        <div class="games-toolbar" style="display: ${showToolbar ? 'flex' : 'none'}">
          <div class="date-navigation">
            <button class="nav-button prev-date" aria-label="Previous day">‹</button>
            <span class="current-date">${this.formatDate(this.currentDate || '')}</span>
            <button class="nav-button next-date" aria-label="Next day">›</button>
            <button class="nav-button today" aria-label="Today">${translate('today', this.widget)}</button>
          </div>
          <div class="game-filters" style="display: ${showFilters ? 'flex' : 'none'}">
            <button class="filter-button ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
              ${translate('all', this.widget)}
            </button>
            <button class="filter-button ${this.currentFilter === 'live' ? 'active' : ''}" data-filter="live">
              ${translate('live', this.widget)}
            </button>
            <button class="filter-button ${this.currentFilter === 'finished' ? 'active' : ''}" data-filter="finished">
              ${translate('finished', this.widget)}
            </button>
            <button class="filter-button ${this.currentFilter === 'scheduled' ? 'active' : ''}" data-filter="scheduled">
              ${translate('scheduled', this.widget)}
            </button>
          </div>
        </div>
        <div class="games-list">
          <div class="loading">${translate('loading', this.widget)}...</div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Date navigation
    this.querySelector('.prev-date')?.addEventListener('click', () => this.changeDate(-1));
    this.querySelector('.next-date')?.addEventListener('click', () => this.changeDate(1));
    this.querySelector('.today')?.addEventListener('click', () => this.goToToday());

    // Filters
    this.querySelectorAll('.filter-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const filter = (e.target as HTMLElement).dataset.filter as any;
        this.setFilter(filter);
      });
    });
  }

  async loadGames() {
    const gamesListEl = this.querySelector('.games-list');
    if (!gamesListEl) return;

    showLoading(gamesListEl as HTMLElement);

    try {
      const params: any = {};

      // Add date parameter
      if (this.currentDate) {
        params.date = this.currentDate;
      }

      // Add league parameter if specified
      const league = this.widget.dataset.league || this.dataset.league;
      if (league) {
        params.league = league;
      }

      // Add team parameter if specified
      const team = this.widget.dataset.team || this.dataset.team;
      if (team) {
        params.team = team;
      }

      // Add season parameter if specified
      const season = this.widget.dataset.season || this.dataset.season;
      if (season) {
        params.season = season;
      }

      this.games = await fetchGames(this.widget, params);

      if (!this.games || this.games.length === 0) {
        gamesListEl.innerHTML = `<p class="empty-result">${translate('no_games_available', this.widget)}</p>`;
        return;
      }

      this.filterGames();
    } catch (error) {
      console.error('Error loading games:', error);
      gamesListEl.innerHTML = `<p class="error">${translate('error_loading_games', this.widget)}</p>`;
    }
  }

  setFilter(filter: 'all' | 'live' | 'finished' | 'scheduled') {
    this.currentFilter = filter;

    // Update button states
    this.querySelectorAll('.filter-button').forEach((button) => {
      if ((button as HTMLElement).dataset.filter === filter) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    this.filterGames();
  }

  filterGames() {
    if (this.currentFilter === 'all') {
      this.filteredGames = this.games;
    } else {
      this.filteredGames = this.games.filter((game) => {
        const status = game.status?.short?.toLowerCase();
        switch (this.currentFilter) {
          case 'live':
            return status === 'live' || status === '1h' || status === '2h';
          case 'finished':
            return status === 'ft' || status === 'aet' || status === 'pen';
          case 'scheduled':
            return status === 'ns' || status === 'tbd';
          default:
            return true;
        }
      });
    }

    this.renderGames();
  }

  renderGames() {
    const gamesListEl = this.querySelector('.games-list');
    if (!gamesListEl) return;

    if (this.filteredGames.length === 0) {
      gamesListEl.innerHTML = `<div class="empty-message">${translate('no_games_found', this.widget)}</div>`;
      return;
    }

    // Group by league
    const gamesByLeague = this.groupByLeague(this.filteredGames);

    gamesListEl.innerHTML = '';
    for (const [_leagueId, leagueGames] of Object.entries(gamesByLeague)) {
      const league = (leagueGames as any[])[0].league;

      const leagueSection = document.createElement('div');
      leagueSection.className = 'league-section';
      leagueSection.innerHTML = `
        <div class="league-header">
          ${league?.logo ? `<img src="${league.logo}" alt="${league.name}" class="league-logo">` : ''}
          <span class="league-name">${league?.name || translate('unknown_league', this.widget)}</span>
        </div>
        <div class="league-games"></div>
      `;

      const leagueGamesContainer = leagueSection.querySelector('.league-games');
      (leagueGames as any[]).forEach((game) => {
        const gameEl = this.renderGameItem(game);
        leagueGamesContainer?.appendChild(gameEl);
      });

      gamesListEl.appendChild(leagueSection);
    }
  }

  private renderGameItem(game: any): HTMLElement {
    const gameEl = document.createElement('div');
    gameEl.className = 'game-item';
    gameEl.dataset.gameId = game.fixture?.id || game.id;

    const fixture = game.fixture || game;
    const teams = game.teams || {};
    const goals = game.goals || {};

    const homeTeam = teams.home || {};
    const awayTeam = teams.away || {};

    const status = fixture.status?.short || 'NS';
    const statusClass = this.getStatusClass(status);

    gameEl.innerHTML = `
      <div class="game-content ${statusClass}">
        <div class="game-time">
          ${this.formatGameTime(fixture)}
        </div>
        <div class="game-teams">
          <div class="team home-team">
            ${homeTeam.logo ? `<img src="${homeTeam.logo}" alt="${homeTeam.name}" class="team-logo-sm">` : ''}
            <span class="team-name">${homeTeam.name || ''}</span>
            <span class="team-score">${goals.home !== null && goals.home !== undefined ? goals.home : '-'}</span>
          </div>
          <div class="team away-team">
            ${awayTeam.logo ? `<img src="${awayTeam.logo}" alt="${awayTeam.name}" class="team-logo-sm">` : ''}
            <span class="team-name">${awayTeam.name || ''}</span>
            <span class="team-score">${goals.away !== null && goals.away !== undefined ? goals.away : '-'}</span>
          </div>
        </div>
        <div class="game-status">
          ${this.formatGameStatus(fixture.status)}
        </div>
      </div>
    `;

    // Add click handler to open game details
    gameEl.addEventListener('click', () => {
      this.openGameDetail(game);
    });

    return gameEl;
  }

  private getStatusClass(status: string): string {
    const lowerStatus = status.toLowerCase();
    if (['1h', '2h', 'ht', 'live', 'inplay'].includes(lowerStatus)) return 'live';
    if (['ft', 'aet', 'pen', 'finished'].includes(lowerStatus)) return 'finished';
    return 'scheduled';
  }

  private formatGameTime(fixture: any): string {
    if (!fixture.date) return '';

    const date = new Date(fixture.date);
    return date.toLocaleTimeString(this.widget.lang || 'en', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatGameStatus(status: any): string {
    if (!status) return '';

    const statusMap: Record<string, string> = {
      'NS': 'scheduled',
      'TBD': 'tbd',
      '1H': 'first_half',
      'HT': 'half_time',
      '2H': 'second_half',
      'FT': 'finished',
      'AET': 'extra_time',
      'PEN': 'penalties',
      'LIVE': 'live',
    };

    const translationKey = statusMap[status.short] || status.short;
    return translate(translationKey, this.widget);
  }

  private openGameDetail(game: any) {
    // Dispatch event to widget to open game detail modal
    const event = new CustomEvent('open-game-detail', {
      bubbles: true,
      detail: { game },
    });
    this.dispatchEvent(event);
  }

  groupByLeague(games: any[]): Record<string, any[]> {
    return games.reduce((acc, game) => {
      const leagueId = game.league?.id || 'unknown';
      if (!acc[leagueId]) {
        acc[leagueId] = [];
      }
      acc[leagueId].push(game);
      return acc;
    }, {} as Record<string, any[]>);
  }

  changeDate(days: number) {
    if (!this.currentDate) return;

    const date = new Date(this.currentDate);
    date.setDate(date.getDate() + days);
    this.currentDate = date.toISOString().split('T')[0];

    this.updateDateDisplay();
    this.loadGames();
  }

  goToToday() {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.updateDateDisplay();
    this.loadGames();
  }

  updateDateDisplay() {
    const dateEl = this.querySelector('.current-date');
    if (dateEl && this.currentDate) {
      dateEl.textContent = this.formatDate(this.currentDate);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  async updateGames(_force: boolean = false, dateChanged: boolean = false) {
    if (dateChanged && this.widget) {
      this.currentDate = this.widget.dataset.date || new Date().toISOString().split('T')[0];
      this.updateDateDisplay();
    }
    await this.loadGames();
  }
}

if (!customElements.get('games-component')) {
  customElements.define('games-component', GamesComponent);
}
