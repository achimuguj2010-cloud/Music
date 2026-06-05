import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useRef, useCallback } from 'react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isShuffle,
    isRepeat,
    isLiked,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    seekTo,
    setVolumeLevel,
  } = useAudio();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      seekTo(Math.max(0, Math.min(1, pct)));
    },
    [duration, seekTo]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      setVolumeLevel(Math.max(0, Math.min(1, pct)));
    },
    [setVolumeLevel]
  );

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="fixed left-0 right-0 cursor-pointer"
        style={{
          bottom: '90px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          zIndex: 60,
        }}
        onClick={handleProgressClick}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Player bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center px-4 md:px-6"
        style={{
          height: '90px',
          backgroundColor: '#14141C',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          zIndex: 60,
        }}
      >
        {/* Now Playing - Left */}
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          {currentTrack ? (
            <>
              <div
                className="w-11 h-11 rounded flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#1E1E28' }}
              >
                {currentTrack.image ? (
                  <img
                    src={currentTrack.image}
                    alt={currentTrack.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg">&#9835;</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: '#F3F4F6' }}
                >
                  {currentTrack.name}
                </p>
                <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>
                  {currentTrack.artist_name}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: '#1E1E28' }}
              >
                <span className="text-lg">&#9835;</span>
              </div>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                Select a track to play
              </p>
            </div>
          )}
        </div>

        {/* Controls - Center */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className="p-2 rounded-full transition-all"
              style={{
                color: isShuffle ? '#F59E0B' : '#9CA3AF',
                transform: 'scale(1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-2 rounded-full transition-all"
              style={{ color: '#F3F4F6', transform: 'scale(1)' }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              title="Previous"
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!currentTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: currentTrack
                  ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transform: 'scale(1)',
              }}
              onMouseDown={e => currentTrack && (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 rounded-full transition-all"
              style={{ color: '#F3F4F6', transform: 'scale(1)' }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              title="Next"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className="p-2 rounded-full transition-all"
              style={{
                color: isRepeat ? '#F59E0B' : '#9CA3AF',
                transform: 'scale(1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time display */}
          <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <span>/</span>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume + Like - Right */}
        <div className="flex items-center gap-3 w-[30%] justify-end">
          <button
            onClick={toggleLike}
            className="p-2 rounded-full transition-all"
            style={{
              color: isLiked ? '#10B981' : '#9CA3AF',
              transform: 'scale(1)',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            title="Like"
          >
            <Heart
              className="w-5 h-5"
              fill={isLiked ? '#10B981' : 'none'}
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolumeLevel(volume === 0 ? 0.8 : 0)}
              className="p-1"
              style={{ color: '#9CA3AF' }}
            >
              <VolumeIcon className="w-4 h-4" />
            </button>
            <div
              ref={volumeRef}
              className="w-20 h-1 rounded-full cursor-pointer"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={handleVolumeClick}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${volumePercent}%`,
                  background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
