/**
 * Main AnymalWidget Web Component
 * Supports multiple sports: football, basketball, baseball, F1, MMA, handball, volleyball, rugby, hockey, AFL
 */

import type { Sport, WidgetType } from '../types/index.js';
import { getSafeTimeZone, formatDate } from '../utils/helpers.js';
import { setLanguage, setCustomTranslations } from '../utils/i18n.js';
import { DEFAULT_LOGO_BASE_URL, DEFAULT_ENDPOINTS } from '../config/endpoints.js';

const SUPPORTED_SPORTS: Sport[] = [
  'football',
  'basketball',
  'baseball',
  'f1',
  'mma',
  'handball',
  'volleyball',
  'rugby',
  'hockey',
];

const SUPPORTED_TYPES: WidgetType[] = [
  'games',
  'standings',
  'game',
  'leagues',
  'league',
  'h2h',
  'team',
  'player',
  'driver',
  'fighter',
  'fights',
  'races',
  'race',
  'fight',
];

export class AnymalWidget extends HTMLElement {
  // Configuration properties
  key?: string;
  lang: string = 'en';
  customLang?: string;
  customTranslations: Record<string, any> = {};
  sport: Sport = 'football';
  country: string = '';
  timeZone: string = '';
  typeWidget: WidgetType = 'games';
  theme?: string;

  // IDs for specific views
  gameId?: string;
  fightId?: string;
  raceId?: string;
  teamId?: string;
  playerId?: string;
  driverId?: string;
  fighterId?: string;
  h2h?: string;
  league?: string;
  season?: string;

  // Display settings
  logoBaseUrl: string = DEFAULT_LOGO_BASE_URL;
  gamesStyle: string = '1';
  showLogos: boolean = false;
  showToolbar: boolean = true;

  // Feature flags
  errorEnabled: boolean = false;
  favoritesEnabled: boolean = false;
  teamSquadEnabled: boolean = false;
  teamStatsEnabled: boolean = false;
  playerStatsEnabled: boolean = false;
  eventsEnabled: boolean = false;
  rankingsEnabled: boolean = false;
  fastestLapsEnabled: boolean = false;
  startingGridEnabled: boolean = false;
  pitStopsEnabled: boolean = false;
  standingsEnabled: boolean = false;
  fightResultsEnabled: boolean = false;
  statisticsEnabled: boolean = false;
  quartersEnabled: boolean = false;
  playerTrophiesEnabled: boolean = false;
  playerInjuriesEnabled: boolean = false;

  // Tab defaults
  tabDefault?: string;
  gameTabDefault?: string;
  teamTabDefault?: string;

  // Target URLs
  targetGame?: string;
  targetFight?: string;
  targetRace?: string;
  targetStandings?: string;
  targetTeam?: string;
  targetPlayer?: string;
  targetDriver?: string;
  targetFighter?: string;
  targetLeague?: string;

  // Custom base URLs for different sports
  customBaseUrls: Partial<Record<Sport, string>> = {};

  /**
   * Get the API endpoint URL for the current sport
   * @returns The API base URL
   */
  getApiEndpoint(): string {
    return this.customBaseUrls[this.sport] || DEFAULT_ENDPOINTS[this.sport];
  }

  // Refresh settings
  refresh: number = 0;
  refreshInterval: number = 0;
  refreshPaused: boolean = false;

  // Internal state
  private _currentDate?: string;
  private _currentYear?: string;
  today?: string;
  inModal: boolean = false;
  mainComponent?: any;

  static get observedAttributes() {
    return ['data-date', 'data-year', 'data-sport', 'data-type', 'data-theme'];
  }

  get currentDate() {
    return this._currentDate;
  }

  set currentDate(value: string | undefined) {
    if (this._currentDate !== value) {
      this._currentDate = value;
      if (this.mainComponent && typeof this.mainComponent.updateGames === 'function') {
        this.mainComponent.updateGames(false, true);
      }
    }
  }

  get currentYear() {
    return this._currentYear;
  }

  set currentYear(value: string | undefined) {
    if (this._currentYear !== value) {
      this._currentYear = value;
      if (this.mainComponent && typeof this.mainComponent.updateGames === 'function') {
        this.mainComponent.updateGames(false, true);
      }
    }
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    // Skip initialization for config widgets
    if (this.dataset.type === 'config') {
      return;
    }

    this.initConfig();
    this.refreshPaused = false;
    this.timeZone = getSafeTimeZone(this.timeZone);

    // Validate sport
    if (!this.sport || !SUPPORTED_SPORTS.includes(this.sport)) {
      this.showError('Please specify a sport', 'warn');
      this.sport = 'football';
    }

    // Validate and set widget type based on sport
    if (!this.typeWidget || !SUPPORTED_TYPES.includes(this.typeWidget)) {
      this.showError('Please specify a valid widget type', 'warn');
      if (this.sport === 'f1') {
        this.typeWidget = 'races';
      } else if (this.sport === 'mma') {
        this.typeWidget = 'fights';
      } else {
        this.typeWidget = 'games';
      }
    }

    // Wait for sequential loading
    await this.initSequential();
  }

  async initSequential() {
    this.refreshPaused = false;
    this.timeZone = getSafeTimeZone(this.timeZone);
    this.inModal = this.isInModal();

    // Load styles
    await this.loadStyles();

    // Load custom language if specified
    if (this.customLang) {
      await this.loadCustomLanguage();
    }

    // Initialize current date
    this.initializeCurrentDate();

    // Route to appropriate handler based on widget type
    const handlers: Partial<Record<WidgetType, () => Promise<void>>> = {
      standings: () => this.handleStandings(),
      game: () => this.handleGame(),
      leagues: () => this.handleLeagues(),
      league: () => this.handleGames(),
      h2h: () => this.handleGames(),
      games: () => this.handleGames(),
      team: () => this.handleTeam(),
      player: () => this.handlePlayer(),
      fights: () => this.handleFights(),
      fighter: () => this.handleFighter(),
      driver: () => this.handleDriver(),
      races: () => this.handleRaces(),
      race: () => this.handleGame(),
      fight: () => this.handleGame(),
    };

    const handler = handlers[this.typeWidget];
    if (handler) {
      await handler();
    }

    // Load favorites if enabled
    if (this.favoritesEnabled) {
      await this.loadComponent('favorite-star');
    }

    this.classList.add('initialized');
  }

  initConfig() {
    if (this.dataset.type === 'config') {
      return;
    }

    // Find config widget
    const configWidget = document.querySelector<AnymalWidget>('anymal-widget[data-type="config"]');
    if (!configWidget) {
      return;
    }

    // Merge config with dataset
    const mergedData = { ...configWidget.dataset, ...this.dataset };

    // Helper to parse boolean attributes
    const parseBool = (value: string | undefined, defaultValue: boolean = false): boolean => {
      if (value === undefined) return defaultValue;
      return value === 'true';
    };

    // Assign all configuration properties
    Object.assign(this, {
      key: mergedData.key,
      lang: mergedData.lang || configWidget.lang || 'en',
      customLang: mergedData.customLang || null,
      customTranslations: configWidget.customTranslations || {},
      sport: (mergedData.sport as Sport) ?? 'football',
      country: mergedData.country?.toLowerCase() ?? '',
      timeZone: getSafeTimeZone(mergedData.timezone),
      typeWidget: mergedData.type as WidgetType,
      gameId: mergedData.gameId || null,
      fightId: mergedData.fightId || null,
      raceId: mergedData.raceId || null,
      teamId: mergedData.teamId || null,
      h2h: mergedData.h2h || '',
      playerId: mergedData.playerId || null,
      driverId: mergedData.driverId || null,
      fighterId: mergedData.fighterId || null,
      tabDefault: mergedData.tab || null,
      gameTabDefault: mergedData.gameTab || null,
      teamTabDefault: mergedData.teamTab || null,
      logoBaseUrl: mergedData.logoUrl ?? DEFAULT_LOGO_BASE_URL,
      league: mergedData.league ?? '',
      season: mergedData.season ?? '',
      gamesStyle: mergedData.gamesStyle || '1',
      errorEnabled: parseBool(mergedData.showError),
      showLogos: parseBool(mergedData.showLogos),
      showToolbar: parseBool(mergedData.showToolbar, true),
      favoritesEnabled: parseBool(mergedData.favorite),
      teamSquadEnabled: parseBool(mergedData.teamSquad),
      teamStatsEnabled: parseBool(mergedData.teamStatistics),
      playerStatsEnabled: parseBool(mergedData.playerStatistics),
      eventsEnabled: parseBool(mergedData.events),
      rankingsEnabled: parseBool(mergedData.rankings),
      fastestLapsEnabled: parseBool(mergedData.fastestLaps),
      startingGridEnabled: parseBool(mergedData.startingGrid),
      pitStopsEnabled: parseBool(mergedData.pitStops),
      standingsEnabled: parseBool(mergedData.standings),
      fightResultsEnabled: parseBool(mergedData.fightResults),
      statisticsEnabled: parseBool(mergedData.statistics),
      quartersEnabled: parseBool(mergedData.quarters),
      playerTrophiesEnabled: parseBool(mergedData.playerTrophies),
      playerInjuriesEnabled: parseBool(mergedData.playerInjuries),
      targetGame: mergedData.targetGame,
      targetFight: mergedData.targetFight,
      targetRace: mergedData.targetRace,
      targetStandings: mergedData.targetStandings,
      targetTeam: mergedData.targetTeam,
      targetPlayer: mergedData.targetPlayer,
      targetDriver: mergedData.targetDriver,
      targetFighter: mergedData.targetFighter,
      targetLeague: mergedData.targetLeague || null,
    });

    // Set custom base URLs
    this.customBaseUrls = {
      football: mergedData.urlFootball || undefined,
      baseball: mergedData.urlBaseball || undefined,
      basketball: mergedData.urlBasketball || undefined,
      handball: mergedData.urlHandball || undefined,
      hockey: mergedData.urlHockey || undefined,
      rugby: mergedData.urlRugby || undefined,
      volleyball: mergedData.urlVolleyball || undefined,
    };

    // Configure refresh interval
    const refreshValue = mergedData.refresh === 'true' ? 15 : parseInt(mergedData.refresh || '0', 10);
    this.refresh = refreshValue <= 0 ? 0 : Math.max(refreshValue, 15);
    this.refreshInterval = this.refresh * 1000;

    // Set all data attributes
    for (const [key, value] of Object.entries(mergedData)) {
      if (key !== 'type' && value) {
        const attrName = 'data-' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
        this.setAttribute(attrName, value);
      }
    }
  }

  initializeCurrentDate() {
    const now = new Date();
    const currentDate = formatDate(now, this.timeZone);
    this.today = this.getTodayInTimezone(this.timeZone);
    this._currentDate = this.dataset.date || currentDate;
    this._currentYear = new Date().getFullYear().toString();
  }

  getTodayInTimezone(timeZone: string): string {
    return formatDate(new Date(), timeZone);
  }

  async loadCustomLanguage() {
    try {
      if (!this.customLang) return;

      const langCode = this.customLang.split('/').pop()?.split('.')[0].slice(0, 2) || 'en';
      const response = await fetch(this.customLang);

      if (!response.ok) {
        throw new Error(`Failed to load language file: ${this.customLang}`);
      }

      this.customTranslations = await response.json();
      this.lang = langCode;
      setLanguage(this.lang);
      setCustomTranslations(this.customTranslations);
    } catch (error) {
      console.error('Error loading custom language:', error);
      this.customTranslations = {};
    }
  }

  async loadStyles() {
    // Styles will be injected by Vite plugin
    return Promise.resolve();
  }

  async loadComponent(_tagName: string): Promise<void> {
    // Dynamic component loading will be handled by the build system
    return Promise.resolve();
  }

  isInModal(): boolean {
    let element: HTMLElement | null = this;
    while (element) {
      if (element.classList?.contains('modal') || element.tagName === 'MODAL-COMPONENT') {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    options?: { className?: string; attributes?: Record<string, string> },
    parent?: HTMLElement
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (options?.className) {
      element.className = options.className;
    }
    if (options?.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        element.setAttribute(key, value);
      }
    }
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }

  showError(message: string, level: 'error' | 'warn' = 'error') {
    if (this.errorEnabled || level === 'error') {
      console[level](`[AnymalWidget] ${message}`);
      if (level === 'error') {
        this.innerHTML = `<div class="error">${message}</div>`;
      }
    }
  }

  // Widget type handlers
  async handleGames() {
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('games-component');
    this.mainComponent = this.createElement(
      'games-component' as any,
      {
        attributes: {
          'data-type': this.typeWidget,
          'data-date': this._currentDate || '',
        },
      },
      container
    );
  }

  async handleGame() {
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('game-detail');
    this.mainComponent = this.createElement(
      'game-detail' as any,
      {
        attributes: {
          'data-game-id': this.gameId || this.fightId || this.raceId || '',
        },
      },
      container
    );
  }

  async handleStandings() {
    if (!this.league) {
      return this.showError('League parameter is required for standings widget.');
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('standing-component');
    this.mainComponent = this.createElement(
      'standing-component' as any,
      {
        attributes: {
          'data-league': this.league,
          'data-season': this.season || '',
        },
      },
      container
    );
  }

  async handleLeagues() {
    if (this.sport === 'afl' || this.sport === 'f1' || this.sport === 'mma') {
      return this.showError(`Leagues widget is not available for ${this.sport}.`);
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('leagues-component');
    this.mainComponent = this.createElement('leagues-component' as any, {}, container);
  }

  async handleTeam() {
    if (!this.teamId) {
      return this.showError('Team ID parameter is required for team widget.');
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('team-detail');
    this.mainComponent = this.createElement(
      'team-detail' as any,
      {
        attributes: {
          'data-team-id': this.teamId,
        },
      },
      container
    );
  }

  async handlePlayer() {
    if (!this.playerId) {
      return this.showError('Player ID parameter is required for player widget.');
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('player-detail');
    this.mainComponent = this.createElement(
      'player-detail' as any,
      {
        attributes: {
          'data-player-id': this.playerId,
        },
      },
      container
    );
  }

  async handleDriver() {
    if (this.sport !== 'f1') {
      return this.showError(`Driver widget is only available for F1.`);
    }
    if (!this.driverId) {
      return this.showError('Driver ID parameter is required for driver widget.');
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('driver-detail');
    this.mainComponent = this.createElement(
      'driver-detail' as any,
      {
        attributes: {
          'data-driver-id': this.driverId,
        },
      },
      container
    );
  }

  async handleFighter() {
    if (this.sport !== 'mma') {
      return this.showError(`Fighter widget is only available for MMA.`);
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    // Fighter detail component would be loaded here
    this.mainComponent = container;
  }

  async handleFights() {
    if (this.sport !== 'mma') {
      return this.showError(`Fights widget is only available for MMA.`);
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('games-component');
    this.mainComponent = this.createElement(
      'games-component' as any,
      {
        attributes: {
          'data-type': this.typeWidget,
          'data-season': this.season ?? this._currentYear ?? '',
        },
      },
      container
    );
  }

  async handleRaces() {
    if (this.sport !== 'f1') {
      return this.showError(`Races widget is only available for F1.`);
    }
    const container = this.createElement('div', { className: 'widget-container active' }, this);
    await this.loadComponent('games-component');
    this.mainComponent = this.createElement(
      'games-component' as any,
      {
        attributes: {
          'data-type': this.typeWidget,
          'data-season': this.season ?? this._currentYear ?? '',
        },
      },
      container
    );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-date':
        this.currentDate = newValue;
        break;
      case 'data-year':
        this.currentYear = newValue;
        break;
      case 'data-sport':
        this.sport = newValue as Sport;
        break;
      case 'data-type':
        this.typeWidget = newValue as WidgetType;
        break;
      case 'data-theme':
        this.theme = newValue;
        break;
    }
  }

  disconnectedCallback() {
    // Cleanup if needed
    this.refreshPaused = true;
  }
}

// Define the custom element
if (!customElements.get('anymal-widget')) {
  customElements.define('anymal-widget', AnymalWidget);
}
