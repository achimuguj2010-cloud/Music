import { useState, useEffect } from 'react';
import { Clock, Play, Trash2 } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import type { ITunesTrack } from '@/services/itunesApi';

interface LibraryItem {
  track: ITunesTrack;
  addedAt: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Library() {
  const { playTrack, currentTrack, isPlaying, togglePlay, setTracks } = useAudio();
  const [library, setLibrary] = useState<LibraryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sonic_library');
    if (stored) {
      try {
        setLibrary(JSON.parse(stored));
      } catch {
        setLibrary([]);
      }
    }
  }, []);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem('sonic_library', JSON.stringify(library));
    }
  }, [library]);

  const handlePlayTrack = (track: ITunesTrack, index: number) => {
    const trackList = library.map(item => item.track);
    setTracks(trackList);
    playTrack(track, index, trackList);
  };

  const handleRemoveTrack = (trackId: string) => {
    const updated = library.filter(item => item.track.id !== trackId);
    setLibrary(updated);
    if (updated.length === 0) {
      localStorage.removeItem('sonic_library');
    }
  };

  const handleAddToLibrary = () => {
    // For demo purposes, add current track to library
    if (currentTrack) {
      const exists = library.some(item => item.track.id === currentTrack.id);
      if (!exists) {
        setLibrary(prev => [
          ...prev,
          { track: currentTrack, addedAt: new Date().toISOString() },
        ]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#F3F4F6' }}>
          Your Library
        </h1>
        {currentTrack && (
          <button
            onClick={handleAddToLibrary}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-transform"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#fff',
              transform: 'scale(1)',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add Current Track
          </button>
        )}
      </div>

      {/* Library list */}
      {library.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-xl"
          style={{
            backgroundColor: '#14141C',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#1E1E28' }}
          >
            <span className="text-3xl">&#9835;</span>
          </div>
          <p className="text-lg font-medium mb-1" style={{ color: '#F3F4F6' }}>
            Your library is empty
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Start adding tracks you love
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#14141C',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Table header */}
          <div
            className="grid items-center px-4 py-3 text-xs font-medium uppercase"
            style={{
              gridTemplateColumns: '48px 1fr 1fr 80px 48px',
              color: '#9CA3AF',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <span>#</span>
            <span>Title</span>
            <span>Artist</span>
            <span className="flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <span></span>
          </div>

          {/* Tracks */}
          {library.map((item, index) => {
            const isCurrentTrack = currentTrack?.id === item.track.id;
            return (
              <div
                key={item.track.id}
                className="grid items-center px-4 py-3 transition-colors cursor-pointer group"
                style={{
                  gridTemplateColumns: '48px 1fr 1fr 80px 48px',
                  backgroundColor: isCurrentTrack ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                }}
                onMouseEnter={e => {
                  if (!isCurrentTrack) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = isCurrentTrack
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'transparent';
                }}
              >
                {/* Index / Play */}
                <div className="flex items-center">
                  <span
                    className="text-sm group-hover:hidden"
                    style={{ color: isCurrentTrack ? '#F59E0B' : '#9CA3AF' }}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <span className="flex gap-0.5">
                        <span
                          className="w-0.5 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: '#F59E0B' }}
                        />
                        <span
                          className="w-0.5 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: '#F59E0B', animationDelay: '0.1s' }}
                        />
                        <span
                          className="w-0.5 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: '#F59E0B', animationDelay: '0.2s' }}
                        />
                      </span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <button
                    className="hidden group-hover:flex items-center justify-center"
                    onClick={() =>
                      isCurrentTrack ? togglePlay() : handlePlayTrack(item.track, index)
                    }
                  >
                    {isCurrentTrack && isPlaying ? (
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                      >
                        <span className="flex gap-0.5">
                          <span
                            className="w-0.5 h-2.5 rounded-full"
                            style={{ backgroundColor: '#F59E0B' }}
                          />
                          <span
                            className="w-0.5 h-2.5 rounded-full"
                            style={{ backgroundColor: '#F59E0B' }}
                          />
                        </span>
                      </span>
                    ) : (
                      <Play className="w-4 h-4" style={{ color: '#F3F4F6' }} fill="currentColor" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: '#1E1E28' }}
                  >
                    {item.track.artworkUrl100 ? (
                      <img
                        src={item.track.artworkUrl100}
                        alt={item.track.trackName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm">&#9835;</span>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isCurrentTrack ? '#F59E0B' : '#F3F4F6' }}
                  >
                    {item.track.trackName}
                  </span>
                </div>

                {/* Artist */}
                <span className="text-sm truncate" style={{ color: '#9CA3AF' }}>
                  {item.track.artistName}
                </span>

                {/* Duration */}
                <span className="text-sm text-center" style={{ color: '#9CA3AF' }}>
                  {formatTime(item.track.trackTimeMillis / 1000)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveTrack(item.track.id)}
                  className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
