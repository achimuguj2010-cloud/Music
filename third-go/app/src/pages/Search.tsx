import { useState, useCallback, useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import type { JamendoTrack } from '@/services/jamendoApi';
import { searchTracks, fetchGenreTracks } from '@/services/jamendoApi';
import TrackCard from '@/components/TrackCard';
import { gsap } from 'gsap';

const categories = [
  { title: 'Electronic', emoji: '&#128266;', bg: '#1a1a2e' },
  { title: 'Rock', emoji: '&#127928;', bg: '#2a1a1a' },
  { title: 'Jazz', emoji: '&#127927;', bg: '#1a2a2a' },
  { title: 'Pop', emoji: '&#11088;', bg: '#1a1a3a' },
  { title: 'Hip Hop', emoji: '&#127908;', bg: '#2a1a3a' },
  { title: 'Classical', emoji: '&#127932;', bg: '#1a2a1a' },
  { title: 'Ambient', emoji: '&#127775;', bg: '#2a2a1a' },
  { title: 'Chill', emoji: '&#127808;', bg: '#1a2a3a' },
];

export default function Search() {
  const { playTrack, currentTrack, setTracks } = useAudio();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const tracks = await searchTracks(query, 20);
        setResults(tracks);
        setTracks(tracks);
        setSearched(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, setTracks]);

  // GSAP animation for results
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      gsap.from(resultsRef.current.children, {
        opacity: 0,
        y: 15,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [results]);

  const handleCategoryClick = useCallback(
    async (genre: string) => {
      setQuery(genre);
      setLoading(true);
      try {
        const tracks = await fetchGenreTracks(genre, 20);
        setResults(tracks);
        setTracks(tracks);
        setSearched(true);
      } catch (err) {
        console.error('Genre search error:', err);
      } finally {
        setLoading(false);
      }
    },
    [setTracks]
  );

  const handlePlayTrack = (track: JamendoTrack, index: number) => {
    playTrack(track, index, results);
  };

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: '#9CA3AF' }}
        />
        <input
          type="text"
          placeholder="Search artists, tracks, or genres..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none transition-colors"
          style={{
            backgroundColor: '#1E1E28',
            color: '#F3F4F6',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(245, 158, 11, 0.3)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* Search results */}
      {searched && !loading && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-5" style={{ color: '#F3F4F6' }}>
            Results for &ldquo;{query}&rdquo;
          </h2>
          <div ref={resultsRef} className="flex flex-wrap gap-6">
            {results.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index}
                onPlay={handlePlayTrack}
                isActive={currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: '#9CA3AF' }}>
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Try a different search term or genre
          </p>
        </div>
      )}

      {/* Categories - only show when no search */}
      {!searched && (
        <div ref={categoriesRef}>
          <h2 className="text-xl font-semibold mb-5" style={{ color: '#F3F4F6' }}>
            Browse by Genre
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <button
                key={cat.title}
                onClick={() => handleCategoryClick(cat.title)}
                className="relative h-28 rounded-xl overflow-hidden transition-transform"
                style={{
                  backgroundColor: cat.bg,
                  transform: 'scale(1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span
                    className="text-3xl"
                    dangerouslySetInnerHTML={{ __html: cat.emoji }}
                  />
                  <span className="text-sm font-semibold" style={{ color: '#F3F4F6' }}>
                    {cat.title}
                  </span>
                </div>
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
