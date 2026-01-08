/**
 * API Endpoints Configuration
 * Default base URLs for each sport
 */

import type { Sport } from '../types/index.js';

export const DEFAULT_ENDPOINTS: Record<Sport, string> = {
  football: 'https://api.anymal.xyz/',
  basketball: 'https://basketball.api.anymal.xyz/',
  baseball: 'https://baseball.api.anymal.xyz/',
  handball: 'https://handball.api.anymal.xyz/',
  volleyball: 'https://volleyball.api.anymal.xyz/',
  hockey: 'https://hockey.api.anymal.xyz/',
  rugby: 'https://rugby.api.anymal.xyz/',
  afl: 'https://afl.api.anymal.xyz/',
  mma: 'https://mma.api.anymal.xyz/',
  f1: 'https://formula-1.api.anymal.xyz/',
};

export const DEFAULT_LOGO_BASE_URL = 'https://media-api.anymal.xyz';

/**
 * Get the API endpoint for a specific sport
 * @param sport - The sport type
 * @param customUrl - Optional custom URL override
 * @returns The API base URL for the sport
 */
export function getEndpoint(sport: Sport, customUrl?: string): string {
  return customUrl || DEFAULT_ENDPOINTS[sport];
}
