/**
 * API Utility Functions
 */

import type { Sport } from '../types/index.js';
import type { AnymalWidget } from '../components/AnymalWidget.js';

/**
 * Check if document is not visible
 */
export function isDocumentHidden(widget: AnymalWidget): boolean {
  return document.visibilityState !== 'visible' && (widget as any)._initialized;
}

/**
 * Fetch data from API
 */
export async function fetchFromAPI<T = any>(
  widget: AnymalWidget,
  endpoint: string,
  params: Record<string, any> = {}
): Promise<{ response: T[] }> {
  if (isDocumentHidden(widget)) {
    return { response: [] };
  }

  const baseUrl = widget.getApiEndpoint();
  const url = new URL(`${baseUrl}${endpoint}`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[AnymalWidget] API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch team details
 */
export async function fetchTeamDetails(
  widget: AnymalWidget,
  params: { id: string }
): Promise<any> {
  if (isDocumentHidden(widget)) {
    return null;
  }

  const result = await fetchFromAPI(widget, 'teams', params);

  if (result.response.length === 0) {
    return null;
  }

  // Adapt based on sport
  return adaptTeamData(widget.sport, result.response[0]);
}

/**
 * Fetch team statistics
 */
export async function fetchTeamStatistics(
  widget: AnymalWidget,
  params: { team: string; league?: string; season?: string; id?: string }
): Promise<any> {
  if (isDocumentHidden(widget)) {
    return null;
  }

  const result = await fetchFromAPI(widget, 'teams/statistics', params);

  if (result.response.length === 0) {
    return null;
  }

  return result.response[0];
}

/**
 * Fetch team squad
 */
export async function fetchTeamSquad(
  widget: AnymalWidget,
  params: { team: string; season?: string }
): Promise<any[]> {
  if (isDocumentHidden(widget)) {
    return [];
  }

  const result = await fetchFromAPI(widget, 'players/squads', params);

  return result.response;
}

/**
 * Fetch team leagues
 */
export async function fetchTeamLeagues(
  widget: AnymalWidget,
  params: { team?: string; id?: string }
): Promise<any[]> {
  if (isDocumentHidden(widget)) {
    return [];
  }

  const result = await fetchFromAPI(widget, 'leagues', params);

  return result.response;
}

/**
 * Fetch games/fixtures
 */
export async function fetchGames(
  widget: AnymalWidget,
  params: { date?: string; league?: string; team?: string; season?: string; id?: string }
): Promise<any[]> {
  if (isDocumentHidden(widget)) {
    return [];
  }

  const result = await fetchFromAPI(widget, 'fixtures', params);

  return result.response;
}

/**
 * Fetch game details
 */
export async function fetchGameDetails(
  widget: AnymalWidget,
  params: { id: string }
): Promise<any> {
  if (isDocumentHidden(widget)) {
    return null;
  }

  const result = await fetchFromAPI(widget, 'fixtures', params);

  if (result.response.length === 0) {
    return null;
  }

  return result.response[0];
}

/**
 * Fetch head-to-head data
 */
export async function fetchHeadToHead(
  widget: AnymalWidget,
  params: { h2h: string }
): Promise<any[]> {
  if (isDocumentHidden(widget)) {
    return [];
  }

  const result = await fetchFromAPI(widget, 'fixtures/headtohead', params);

  return result.response;
}

/**
 * Fetch standings
 */
export async function fetchStandings(
  widget: AnymalWidget,
  params: { league: string; season?: string }
): Promise<any[]> {
  if (isDocumentHidden(widget)) {
    return [];
  }

  const result = await fetchFromAPI(widget, 'standings', params);

  return result.response;
}

/**
 * Adapt team data based on sport
 */
function adaptTeamData(_sport: Sport, data: any): any {
  // Basic adaptation - can be expanded per sport
  return {
    team: data.team || data,
    venue: data.venue,
  };
}
