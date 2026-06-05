const ITUNES_API_BASE = 'https://itunes.apple.com/search';

export interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackTimeMillis: number;
  artworkUrl100: string;
  artworkUrl600?: string;
  previewUrl: string | null;
  country: string;
  kind: string;
}

export interface ITunesResponse {
  resultCount: number;
  results: ITunesTrack[];
}

function buildUrl(params: Record<string, string | number>): string {
  const url = new URL(ITUNES_API_BASE);
  url.searchParams.set('media', 'music');
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', String(params.limit || 20));
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && key !== 'limit') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function fetchTracks(params: Record<string, string | number> = {}): Promise<ITunesTrack[]> {
  const url = buildUrl({
    limit: 20,
    ...params,
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status}`);
  }

  const data: ITunesResponse = await response.json();
  // Filter to only return tracks with preview URLs
  return (data.results || []).filter(track => track.previewUrl);
}

export async function searchTracks(query: string, limit: number = 20): Promise<ITunesTrack[]> {
  return fetchTracks({
    term: query,
    limit,
  });
}

export async function fetchTrendingTracks(limit: number = 12): Promise<ITunesTrack[]> {
  // iTunes API doesn't have a direct "trending" endpoint, so we fetch popular artists
  const popularArtists = ['Taylor Swift', 'The Weeknd', 'Bad Bunny', 'Drake', 'Ariana Grande'];
  const artistIndex = Math.floor(Math.random() * popularArtists.length);
  
  return fetchTracks({
    term: popularArtists[artistIndex],
    limit,
  });
}

export async function fetchChillTracks(limit: number = 12): Promise<ITunesTrack[]> {
  return fetchTracks({
    term: 'chill',
    limit,
  });
}

export async function fetchGenreTracks(genre: string, limit: number = 20): Promise<ITunesTrack[]> {
  return fetchTracks({
    term: genre,
    limit,
  });
}
