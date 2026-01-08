/**
 * GameDetail - Detailed view of a single game/match with full API integration
 */

import type { AnymalWidget } from './AnymalWidget.js';
import { showLoading } from '../utils/dom.js';
import { translate } from '../utils/i18n.js';
import { fetchGameDetails, fetchHeadToHead } from '../utils/api.js';

export class GameDetail extends HTMLElement {
  private widget!: AnymalWidget;
  private gameId!: string;
  private gameData: any;
  private h2hData: any[] = [];

  async connectedCallback() {
    this.gameId = this.getAttribute('data-game-id') || this.dataset.gameId || '';
    this.widget = this.closest('anymal-widget') as AnymalWidget;

    if (!this.gameId) {
      this.showError('Game ID is required');
      return;
    }

    try {
      showLoading(this);

      // Fetch game details
      this.gameData = await fetchGameDetails(this.widget, { id: this.gameId });

      if (!this.gameData) {
        this.showError('Game not found');
        return;
      }

      // Fetch head-to-head if teams are available
      if (this.gameData.teams?.home?.id && this.gameData.teams?.away?.id) {
        const h2h = `${this.gameData.teams.home.id}-${this.gameData.teams.away.id}`;
        try {
          this.h2hData = await fetchHeadToHead(this.widget, { h2h });
        } catch (error) {
          console.warn('H2H data not available:', error);
        }
      }

      await this.renderView();
    } catch (error) {
      console.error('Error fetching game:', error);
      this.showError('Error loading game details');
    }
  }

  private async renderView() {
    const { fixture, league, teams, goals, events, lineups, statistics } = this.gameData;

    if (!fixture || !teams) {
      this.showError('Invalid game data');
      return;
    }

    this.innerHTML = `
      <div class="modal-body">
        ${this.renderGameHeader(fixture, league, teams, goals)}

        <div class="game-tabs">
          ${this.widget.dataset.gameStats === 'true' ? `<button class="tab-btn active" data-tab="stats">${translate('statistics', this.widget)}</button>` : ''}
          ${this.widget.dataset.gameEvents === 'true' && events ? `<button class="tab-btn" data-tab="events">${translate('events', this.widget)}</button>` : ''}
          ${this.widget.dataset.gameLineups === 'true' && lineups ? `<button class="tab-btn" data-tab="lineups">${translate('lineups', this.widget)}</button>` : ''}
          ${this.widget.dataset.gameH2h === 'true' && this.h2hData.length > 0 ? `<button class="tab-btn" data-tab="h2h">${translate('h2h', this.widget)}</button>` : ''}
        </div>

        <div class="tab-content" id="tab-content"></div>
      </div>
    `;

    this.addTabListeners();

    // Load first available tab
    if (this.widget.dataset.gameStats === 'true' && statistics) {
      this.loadStatsTab();
    } else if (this.widget.dataset.gameEvents === 'true' && events) {
      this.loadEventsTab();
    } else if (this.widget.dataset.gameLineups === 'true' && lineups) {
      this.loadLineupsTab();
    } else if (this.widget.dataset.gameH2h === 'true' && this.h2hData.length > 0) {
      this.loadH2HTab();
    }
  }

  private renderGameHeader(fixture: any, league: any, teams: any, goals: any): string {
    const homeTeam = teams.home || {};
    const awayTeam = teams.away || {};

    return `
      <div class="game-header-detail">
        ${league ? `
          <div class="league-info">
            ${league.logo ? `<img src="${league.logo}" alt="${league.name}" class="league-logo">` : ''}
            <span class="league-name">${league.name}</span>
            ${league.round ? `<span class="league-round"> - ${league.round}</span>` : ''}
          </div>
        ` : ''}

        <div class="game-match">
          <div class="team-detail home">
            ${homeTeam.logo ? `<img src="${homeTeam.logo}" alt="${homeTeam.name}" class="team-logo-xl">` : ''}
            <h3 class="team-name">${homeTeam.name || ''}</h3>
          </div>

          <div class="game-score">
            <div class="score-display">
              <span class="score home-score">${goals?.home !== null && goals?.home !== undefined ? goals.home : '-'}</span>
              <span class="score-separator">:</span>
              <span class="score away-score">${goals?.away !== null && goals?.away !== undefined ? goals.away : '-'}</span>
            </div>
            <div class="game-status-info">
              ${this.formatGameStatus(fixture.status)}
            </div>
            ${fixture.date ? `<div class="game-date">${this.formatGameDate(fixture.date)}</div>` : ''}
          </div>

          <div class="team-detail away">
            ${awayTeam.logo ? `<img src="${awayTeam.logo}" alt="${awayTeam.name}" class="team-logo-xl">` : ''}
            <h3 class="team-name">${awayTeam.name || ''}</h3>
          </div>
        </div>

        ${fixture.venue ? `
          <div class="venue-info-small">
            <span>${fixture.venue.name || ''}</span>
            ${fixture.venue.city ? ` - ${fixture.venue.city}` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  private addTabListeners() {
    const tabs = this.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const tabName = target.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        target.classList.add('active');

        // Load tab content
        if (tabName === 'stats') {
          this.loadStatsTab();
        } else if (tabName === 'events') {
          this.loadEventsTab();
        } else if (tabName === 'lineups') {
          this.loadLineupsTab();
        } else if (tabName === 'h2h') {
          this.loadH2HTab();
        }
      });
    });
  }

  private loadStatsTab() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    const statistics = this.gameData.statistics;

    if (!statistics || statistics.length === 0) {
      container.innerHTML = `<p class="empty-result">${translate('no_stats_available', this.widget)}</p>`;
      return;
    }

    container.innerHTML = this.renderStatistics(statistics);
  }

  private renderStatistics(statistics: any[]): string {
    if (!statistics || statistics.length < 2) {
      return `<p class="empty-result">${translate('no_stats_available', this.widget)}</p>`;
    }

    const homeStats = statistics[0]?.statistics || [];
    const awayStats = statistics[1]?.statistics || [];

    if (homeStats.length === 0) {
      return `<p class="empty-result">${translate('no_stats_available', this.widget)}</p>`;
    }

    let html = '<div class="game-statistics">';

    homeStats.forEach((stat: any, index: number) => {
      const awayStat = awayStats[index];
      const homeValue = stat.value ?? 0;
      const awayValue = awayStat?.value ?? 0;

      html += `
        <div class="stat-row">
          <div class="stat-value home">${homeValue}</div>
          <div class="stat-label">${translate(stat.type, this.widget)}</div>
          <div class="stat-value away">${awayValue}</div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private loadEventsTab() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    const events = this.gameData.events;

    if (!events || events.length === 0) {
      container.innerHTML = `<p class="empty-result">${translate('no_events_available', this.widget)}</p>`;
      return;
    }

    container.innerHTML = this.renderEvents(events);
  }

  private renderEvents(events: any[]): string {
    if (!events || events.length === 0) {
      return `<p class="empty-result">${translate('no_events_available', this.widget)}</p>`;
    }

    let html = '<div class="game-events">';

    events.forEach((event: any) => {
      const isHome = event.team?.id === this.gameData.teams?.home?.id;
      const teamSide = isHome ? 'home' : 'away';

      html += `
        <div class="event-item ${teamSide}">
          <div class="event-time">${event.time?.elapsed || ''}'${event.time?.extra ? `+${event.time.extra}` : ''}</div>
          <div class="event-icon">${this.getEventIcon(event.type, event.detail)}</div>
          <div class="event-details">
            <div class="event-player">${event.player?.name || ''}</div>
            ${event.assist?.name ? `<div class="event-assist">(${event.assist.name})</div>` : ''}
            <div class="event-type">${translate(event.detail || event.type, this.widget)}</div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private getEventIcon(type: string, detail: string): string {
    const eventIcons: Record<string, string> = {
      'Goal': '⚽',
      'Card': detail === 'Yellow Card' ? '🟨' : '🟥',
      'subst': '🔄',
      'Var': '📺',
    };

    return eventIcons[type] || '•';
  }

  private loadLineupsTab() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    const lineups = this.gameData.lineups;

    if (!lineups || lineups.length === 0) {
      container.innerHTML = `<p class="empty-result">${translate('no_lineups_available', this.widget)}</p>`;
      return;
    }

    container.innerHTML = this.renderLineups(lineups);
  }

  private renderLineups(lineups: any[]): string {
    if (!lineups || lineups.length < 2) {
      return `<p class="empty-result">${translate('no_lineups_available', this.widget)}</p>`;
    }

    const homeLineup = lineups[0];
    const awayLineup = lineups[1];

    let html = '<div class="game-lineups">';

    // Formations
    html += `
      <div class="formations">
        <div class="formation home">${homeLineup.formation || ''}</div>
        <div class="formation-label">${translate('formation', this.widget)}</div>
        <div class="formation away">${awayLineup.formation || ''}</div>
      </div>
    `;

    // Starting XI
    html += `<h4 class="lineup-section-title">${translate('starting_xi', this.widget)}</h4>`;
    html += '<div class="lineups-grid">';
    html += `<div class="lineup-column home">${this.renderLineupPlayers(homeLineup.startXI)}</div>`;
    html += `<div class="lineup-column away">${this.renderLineupPlayers(awayLineup.startXI)}</div>`;
    html += '</div>';

    // Substitutes
    if (homeLineup.substitutes?.length > 0 || awayLineup.substitutes?.length > 0) {
      html += `<h4 class="lineup-section-title">${translate('substitutes', this.widget)}</h4>`;
      html += '<div class="lineups-grid">';
      html += `<div class="lineup-column home">${this.renderLineupPlayers(homeLineup.substitutes)}</div>`;
      html += `<div class="lineup-column away">${this.renderLineupPlayers(awayLineup.substitutes)}</div>`;
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  private renderLineupPlayers(players: any[]): string {
    if (!players || players.length === 0) return '';

    let html = '<div class="lineup-players">';

    players.forEach((item: any) => {
      const player = item.player || item;
      html += `
        <div class="lineup-player">
          <span class="player-number">${player.number || ''}</span>
          <span class="player-name">${player.name || ''}</span>
          ${player.pos ? `<span class="player-position">${player.pos}</span>` : ''}
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private loadH2HTab() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    if (!this.h2hData || this.h2hData.length === 0) {
      container.innerHTML = `<p class="empty-result">${translate('no_h2h_available', this.widget)}</p>`;
      return;
    }

    container.innerHTML = this.renderH2H(this.h2hData);
  }

  private renderH2H(games: any[]): string {
    let html = `<div class="h2h-games"><h4>${translate('recent_matches', this.widget)}</h4>`;

    games.slice(0, 10).forEach((game: any) => {
      const fixture = game.fixture || game;
      const teams = game.teams || {};
      const goals = game.goals || {};

      html += `
        <div class="h2h-game">
          <div class="h2h-date">${this.formatGameDate(fixture.date)}</div>
          <div class="h2h-teams">
            <span class="team-name">${teams.home?.name || ''}</span>
            <span class="h2h-score">${goals.home !== null ? goals.home : '-'} : ${goals.away !== null ? goals.away : '-'}</span>
            <span class="team-name">${teams.away?.name || ''}</span>
          </div>
          <div class="h2h-league">${game.league?.name || ''}</div>
        </div>
      `;
    });

    html += '</div>';
    return html;
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

  private formatGameDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(this.widget.lang || 'en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private showError(message: string) {
    this.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }
}

if (!customElements.get('game-detail')) {
  customElements.define('game-detail', GameDetail);
}
