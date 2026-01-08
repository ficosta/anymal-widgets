/**
 * StandingComponent - League standings table with real API integration
 */

import type { AnymalWidget } from './AnymalWidget.js';
import { showLoading } from '../utils/dom.js';
import { translate } from '../utils/i18n.js';
import { fetchStandings } from '../utils/api.js';

export class StandingComponent extends HTMLElement {
  private widget!: AnymalWidget;
  private league!: string;
  private season?: string;
  private standingsData: any[] = [];

  async connectedCallback() {
    this.widget = this.closest('anymal-widget') as AnymalWidget;

    if (!this.widget) {
      console.error('StandingComponent must be inside anymal-widget');
      return;
    }

    this.league = this.getAttribute('data-league') || this.dataset.league || this.widget.dataset.league || '';
    this.season = this.getAttribute('data-season') || this.dataset.season || this.widget.dataset.season;

    if (!this.league) {
      this.showError('League ID is required');
      return;
    }

    await this.loadStandings();
  }

  private async loadStandings() {
    showLoading(this);

    try {
      const params: any = { league: this.league };

      if (this.season) {
        params.season = this.season;
      }

      this.standingsData = await fetchStandings(this.widget, params);

      if (!this.standingsData || this.standingsData.length === 0) {
        this.showError(translate('no_standings_available', this.widget));
        return;
      }

      this.renderStandings();
    } catch (error) {
      console.error('Error loading standings:', error);
      this.showError(translate('error_loading_standings', this.widget));
    }
  }

  private renderStandings() {
    if (!this.standingsData || this.standingsData.length === 0) {
      this.showError(translate('no_standings_available', this.widget));
      return;
    }

    const standing = this.standingsData[0];
    const league = standing.league;

    let html = `<div class="standing-component">`;

    // League header
    if (league) {
      html += `
        <div class="standings-header">
          ${league.logo ? `<img src="${league.logo}" alt="${league.name}" class="league-logo">` : ''}
          <div class="league-info">
            <h3 class="league-name">${league.name || ''}</h3>
            ${league.country ? `<p class="league-country">${league.country}</p>` : ''}
            ${league.season ? `<p class="league-season">${translate('season', this.widget)}: ${league.season}</p>` : ''}
          </div>
        </div>
      `;
    }

    // Render each standing group (for leagues with multiple groups/conferences)
    standing.league?.standings?.forEach((group: any[], groupIndex: number) => {
      if (standing.league.standings.length > 1) {
        html += `<h4 class="group-title">${translate('group', this.widget)} ${String.fromCharCode(65 + groupIndex)}</h4>`;
      }

      html += this.renderStandingTable(group);
    });

    html += `</div>`;
    this.innerHTML = html;

    // Add click handlers for team rows
    this.addTeamClickHandlers();
  }

  private renderStandingTable(teams: any[]): string {
    if (!teams || teams.length === 0) {
      return `<p class="empty-result">${translate('no_standings_available', this.widget)}</p>`;
    }

    let html = `
      <div class="standings-table-wrapper">
        <table class="standings-table">
          <thead>
            <tr>
              <th class="rank-col">${translate('rank', this.widget)}</th>
              <th class="team-col">${translate('team', this.widget)}</th>
              <th class="num-col" title="${translate('played', this.widget)}">${translate('played_short', this.widget)}</th>
              <th class="num-col" title="${translate('wins', this.widget)}">${translate('wins_short', this.widget)}</th>
              <th class="num-col" title="${translate('draws', this.widget)}">${translate('draws_short', this.widget)}</th>
              <th class="num-col" title="${translate('loses', this.widget)}">${translate('loses_short', this.widget)}</th>
              <th class="num-col" title="${translate('goals_for', this.widget)}">${translate('goals_for_short', this.widget)}</th>
              <th class="num-col" title="${translate('goals_against', this.widget)}">${translate('goals_against_short', this.widget)}</th>
              <th class="num-col" title="${translate('goal_difference', this.widget)}">${translate('goal_difference_short', this.widget)}</th>
              <th class="points-col">${translate('points', this.widget)}</th>
            </tr>
          </thead>
          <tbody>
    `;

    teams.forEach((item: any) => {
      const team = item.team;
      const stats = item.all;
      const rank = item.rank;
      const points = item.points;
      const goalsDiff = item.goalsDiff;
      const form = item.form;
      const description = item.description;

      const rowClass = this.getRowClass(description);

      html += `
        <tr class="standing-row ${rowClass}" data-team-id="${team.id}" data-team-name="${team.name}">
          <td class="rank-col">
            <span class="rank">${rank}</span>
          </td>
          <td class="team-col">
            <div class="team-cell">
              ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="team-logo-sm">` : ''}
              <span class="team-name">${team.name}</span>
            </div>
          </td>
          <td class="num-col">${stats?.played || 0}</td>
          <td class="num-col">${stats?.win || 0}</td>
          <td class="num-col">${stats?.draw || 0}</td>
          <td class="num-col">${stats?.lose || 0}</td>
          <td class="num-col">${stats?.goals?.for || 0}</td>
          <td class="num-col">${stats?.goals?.against || 0}</td>
          <td class="num-col ${goalsDiff > 0 ? 'positive' : goalsDiff < 0 ? 'negative' : ''}">${goalsDiff > 0 ? '+' : ''}${goalsDiff}</td>
          <td class="points-col"><strong>${points}</strong></td>
          ${form ? `<td class="form-col">${this.renderForm(form)}</td>` : ''}
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    // Add legend if there are descriptions
    const hasDescriptions = teams.some(item => item.description);
    if (hasDescriptions) {
      html += this.renderLegend(teams);
    }

    return html;
  }

  private getRowClass(description: string | null): string {
    if (!description) return '';

    const desc = description.toLowerCase();

    if (desc.includes('champions league') || desc.includes('promotion')) {
      return 'promotion-zone';
    }
    if (desc.includes('europa league') || desc.includes('uefa')) {
      return 'europa-zone';
    }
    if (desc.includes('relegation')) {
      return 'relegation-zone';
    }
    if (desc.includes('playoff')) {
      return 'playoff-zone';
    }

    return '';
  }

  private renderForm(form: string): string {
    if (!form) return '';

    let html = '<div class="form-indicators">';

    const formArray = form.split('').slice(-5); // Last 5 matches

    formArray.forEach(result => {
      let className = 'form-indicator';
      if (result === 'W') className += ' win';
      else if (result === 'D') className += ' draw';
      else if (result === 'L') className += ' loss';

      html += `<span class="${className}" title="${result === 'W' ? translate('win', this.widget) : result === 'D' ? translate('draw', this.widget) : translate('loss', this.widget)}">${result}</span>`;
    });

    html += '</div>';
    return html;
  }

  private renderLegend(teams: any[]): string {
    const uniqueDescriptions = new Map<string, string>();

    teams.forEach(item => {
      if (item.description) {
        const className = this.getRowClass(item.description);
        if (className && !uniqueDescriptions.has(className)) {
          uniqueDescriptions.set(className, item.description);
        }
      }
    });

    if (uniqueDescriptions.size === 0) return '';

    let html = '<div class="standings-legend">';

    uniqueDescriptions.forEach((description, className) => {
      html += `
        <div class="legend-item">
          <span class="legend-color ${className}"></span>
          <span class="legend-text">${description}</span>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  private addTeamClickHandlers() {
    const rows = this.querySelectorAll('.standing-row');

    rows.forEach(row => {
      row.addEventListener('click', () => {
        const teamId = (row as HTMLElement).dataset.teamId;
        const teamName = (row as HTMLElement).dataset.teamName;

        if (teamId) {
          const event = new CustomEvent('open-team-detail', {
            bubbles: true,
            detail: { teamId, teamName },
          });
          this.dispatchEvent(event);
        }
      });
    });
  }

  private showError(message: string) {
    this.innerHTML = `
      <div class="standing-component">
        <div class="error-message">
          <p>${message}</p>
        </div>
      </div>
    `;
  }

  async updateStandings() {
    await this.loadStandings();
  }
}

if (!customElements.get('standing-component')) {
  customElements.define('standing-component', StandingComponent);
}
