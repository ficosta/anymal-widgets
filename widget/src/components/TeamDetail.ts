/**
 * TeamDetail - Detailed team information with real API integration
 */

import type { AnymalWidget } from './AnymalWidget.js';
import { showLoading } from '../utils/dom.js';
import { translate, translateCountry } from '../utils/i18n.js';
import { fetchTeamDetails, fetchTeamStatistics, fetchTeamSquad } from '../utils/api.js';

export class TeamDetail extends HTMLElement {
  private widget!: AnymalWidget;
  private teamId!: string;
  private league?: string;
  private season?: string;
  private details: any;
  private teamStatistics: any;
  private teamSquads: any[] = [];


  async connectedCallback() {
    this.teamId = this.getAttribute('data-team-id') || '';
    this.league = this.getAttribute('data-league') || undefined;
    this.season = this.getAttribute('data-season') || undefined;
    this.widget = this.closest('anymal-widget') as AnymalWidget;

    if (!this.teamId) {
      this.showError('Team ID is required');
      return;
    }

    try {
      showLoading(this);

      // Fetch team details
      this.details = await fetchTeamDetails(this.widget, { id: this.teamId });

      if (!this.details) {
        this.showError('Team not found');
        return;
      }

      await this.renderView();
    } catch (error) {
      console.error('Error fetching team:', error);
      this.showError('Error loading team details');
    }
  }

  private async renderView() {
    const { team, venue } = this.details;

    if (!team) {
      this.showError('Invalid team data');
      return;
    }

    this.innerHTML = `
      <div class="modal-body">
        <div class="team-profile">
          <div class="team-header">
            <div>
              <img class="team-logo"
                   src="${this.widget.logoBaseUrl}/teams/${team.id}.png"
                   alt="${team.name}"
                   onerror="this.style.display='none'"/>
            </div>
            <div class="team-infos">
              <h2 class="team-name">${team.name}</h2>
              ${team.founded ? `<p>${translate('founded', this.widget)}: ${team.founded}</p>` : ''}
              ${team.country ? `<p>${translate('country', this.widget)}: ${translateCountry(team.country, this.widget)}</p>` : ''}
              ${team.coach ? `<p>${translate('coach', this.widget)}: ${team.coach}</p>` : ''}
              ${team.stadium || venue?.name ? `<p>${translate('stadium', this.widget)}: ${team.stadium || venue?.name}</p>` : ''}
            </div>
          </div>
        </div>

        ${venue ? this.renderVenue(venue) : ''}

        <div class="team-tabs">
          ${this.widget.dataset.teamStatistics === 'true' ? '<button class="tab-btn active" data-tab="stats">' + translate('statistics', this.widget) + '</button>' : ''}
          ${this.widget.dataset.teamSquad === 'true' ? '<button class="tab-btn" data-tab="squad">' + translate('squad', this.widget) + '</button>' : ''}
        </div>

        <div class="tab-content" id="tab-content"></div>
      </div>
    `;

    this.addTabListeners();

    // Load first tab if available
    if (this.widget.dataset.teamStatistics === 'true') {
      await this.loadStats();
    } else if (this.widget.dataset.teamSquad === 'true') {
      await this.loadSquad();
    }
  }

  private renderVenue(venue: any): string {
    if (!venue?.name) return '';

    return `
      <div class="venue-info">
        ${venue.image ? `<img src="${venue.image}" alt="${venue.name}" class="venue-image" />` : ''}
        <h3>${venue.name}${venue.city ? ` - ${venue.city}` : ''}</h3>
        ${venue.capacity ? `<p>${translate('capacity', this.widget)}: ${venue.capacity.toLocaleString()}</p>` : ''}
        ${venue.address ? `<p>${translate('location', this.widget)}: ${venue.address}</p>` : ''}
      </div>
    `;
  }

  private addTabListeners() {
    const tabs = this.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const tabName = target.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        target.classList.add('active');

        // Load tab content
        if (tabName === 'stats') {
          await this.loadStats();
        } else if (tabName === 'squad') {
          await this.loadSquad();
        }
      });
    });
  }

  private async loadStats() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    showLoading(container as HTMLElement);

    try {
      const params: any = {
        team: this.teamId,
      };

      if (this.league) params.league = this.league;
      if (this.season) params.season = this.season;

      this.teamStatistics = await fetchTeamStatistics(this.widget, params);

      if (!this.teamStatistics) {
        container.innerHTML = `<p class="empty-result">${translate('no_stats_available', this.widget)}</p>`;
        return;
      }

      container.innerHTML = this.renderStats(this.teamStatistics);
    } catch (error) {
      console.error('Error loading team statistics:', error);
      container.innerHTML = `<p class="error">${translate('error_loading_stats', this.widget)}</p>`;
    }
  }

  private renderStats(stats: any): string {
    if (!stats || !stats.fixtures) {
      return `<p class="empty-result">${translate('no_stats_available', this.widget)}</p>`;
    }

    return `
      <div class="team-stats">
        <div class="stat-section">
          <h4>${translate('general', this.widget)}</h4>
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-label">${translate('played', this.widget)}</span>
              <span class="stat-value">${stats.fixtures.played?.total || 0}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">${translate('wins', this.widget)}</span>
              <span class="stat-value">${stats.fixtures.wins?.total || 0}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">${translate('draws', this.widget)}</span>
              <span class="stat-value">${stats.fixtures.draws?.total || 0}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">${translate('loses', this.widget)}</span>
              <span class="stat-value">${stats.fixtures.loses?.total || 0}</span>
            </div>
          </div>
        </div>

        ${stats.goals ? `
        <div class="stat-section">
          <h4>${translate('goals', this.widget)}</h4>
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-label">${translate('goals_for', this.widget)}</span>
              <span class="stat-value">${stats.goals.for?.total?.total || 0}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">${translate('goals_against', this.widget)}</span>
              <span class="stat-value">${stats.goals.against?.total?.total || 0}</span>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  private async loadSquad() {
    const container = this.querySelector('#tab-content');
    if (!container) return;

    showLoading(container as HTMLElement);

    try {
      const params: any = { team: this.teamId };
      if (this.season && this.widget.sport !== 'football') {
        params.season = this.season;
      }

      this.teamSquads = await fetchTeamSquad(this.widget, params);

      if (!this.teamSquads || this.teamSquads.length === 0) {
        container.innerHTML = `<p class="empty-result">${translate('no_squad_available', this.widget)}</p>`;
        return;
      }

      container.innerHTML = this.renderSquad(this.teamSquads);
    } catch (error) {
      console.error('Error loading team squad:', error);
      container.innerHTML = `<p class="error">${translate('error_loading_squad', this.widget)}</p>`;
    }
  }

  private renderSquad(squad: any[]): string {
    const groupedByPosition = squad.reduce((acc: any, player: any) => {
      const position = player.position || 'Unknown';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(player);
      return acc;
    }, {});

    let html = '<div class="team-squads-container">';

    Object.entries(groupedByPosition).forEach(([position, players]: [string, any]) => {
      html += `
        <h3 class="player-group-title">${translate(position, this.widget)}</h3>
        <div class="player-group">
          ${players.map((player: any) => `
            <div class="player-card">
              <img class="player-image"
                   src="${this.widget.logoBaseUrl}/players/${player.id}.png"
                   alt="${player.name}"
                   onerror="this.style.display='none'"/>
              <div class="player-info">
                <div class="player-name">${player.name}</div>
                ${player.number ? `<div class="player-number">#${player.number}</div>` : ''}
                ${player.age ? `<div class="player-age">${player.age} ${translate('years_old', this.widget)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private showError(message: string) {
    this.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }
}

if (!customElements.get('team-detail')) {
  customElements.define('team-detail', TeamDetail);
}
