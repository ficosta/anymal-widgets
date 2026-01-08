/**
 * Core Types for Anymal Widgets
 */

export type Sport =
  | 'football'
  | 'basketball'
  | 'baseball'
  | 'f1'
  | 'mma'
  | 'handball'
  | 'volleyball'
  | 'rugby'
  | 'hockey'
  | 'afl';

export type WidgetType =
  | 'games'
  | 'standings'
  | 'game'
  | 'leagues'
  | 'league'
  | 'h2h'
  | 'team'
  | 'player'
  | 'driver'
  | 'fighter'
  | 'fights'
  | 'races'
  | 'race'
  | 'fight';

export type Theme = 'anymal' | 'dark' | 'grey' | 'blue' | string;

export interface WidgetConfig {
  key?: string;
  lang?: string;
  customLang?: string;
  sport: Sport;
  country?: string;
  timeZone?: string;
  type: WidgetType;
  theme?: Theme;
  gameId?: string;
  fightId?: string;
  raceId?: string;
  teamId?: string;
  playerId?: string;
  driverId?: string;
  fighterId?: string;
  h2h?: string;
  league?: string;
  date?: string;
  year?: string;
  tab?: string;
  gameTab?: string;
  teamTab?: string;
  logoUrl?: string;
  favoritesEnabled?: boolean;
}

export interface GameData {
  id: string;
  sport: Sport;
  league: LeagueInfo;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  score: ScoreInfo;
  status: GameStatus;
  date: string;
  time?: string;
  venue?: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  logo?: string;
  country?: string;
}

export interface LeagueInfo {
  id: string;
  name: string;
  logo?: string;
  country?: string;
}

export interface ScoreInfo {
  home: number;
  away: number;
  periods?: PeriodScore[];
}

export interface PeriodScore {
  home: number;
  away: number;
  label: string;
}

export interface GameStatus {
  long: string;
  short: string;
  elapsed?: number;
}

export interface PlayerData {
  id: string;
  name: string;
  photo?: string;
  position?: string;
  age?: number;
  height?: string;
  weight?: string;
  nationality?: string;
  team?: TeamInfo;
}

export interface StandingsData {
  position: number;
  team: TeamInfo;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  points: number;
  form?: string;
}

export interface Translations {
  [key: string]: string | Translations;
}
