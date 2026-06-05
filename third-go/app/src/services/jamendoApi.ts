const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = '709fa152';

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  image: string;
  audio: string;
  album_image: string;
}

export interface JamendoResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
  };
  results: JamendoTrack[];
}

function buildUrl(endpoint: string, params: Record<string, string>): string {
  const url = new URL(`${JAMENDO_API_BASE}${endpoint}`);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

export async function fetchTracks(params: Record<string, string> = {}): Promise<JamendoTrack[]> {
  const url = buildUrl('/tracks', {
    limit: '20',
    audioformat: 'mp32',
    imagesize: '200',
    include: 'musicinfo',
    ...params,
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Jamendo API error: ${response.status}`);
  }

  const data: JamendoResponse = await response.json();
  return data.results || [];
}

export async function searchTracks(query: string, limit: number = 20): Promise<JamendoTrack[]> {
  return fetchTracks({
    search: query,
    limit: String(limit),
    order: 'relevance',
  });
}

export async function fetchTrendingTracks(limit: number = 12): Promise<JamendoTrack[]> {
  return fetchTracks({
    limit: String(limit),
    order: 'popularity_total',
    featured: '1',
  });
}

export async function fetchChillTracks(limit: number = 12): Promise<JamendoTrack[]> {
  return fetchTracks({
    limit: String(limit),
    fuzzytags: 'chill',
    order: 'buzzrate',
  });
}

export async function fetchGenreTracks(genre: string, limit: number = 20): Promise<JamendoTrack[]> {
  return fetchTracks({
    search: genre,
    limit: String(limit),
    order: 'popularity_month',
  });
}
