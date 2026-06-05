import { useState } from 'react';
import { Play } from 'lucide-react';
import type { ITunesTrack } from '@/services/itunesApi';

interface TrackCardProps {
  track: ITunesTrack;
  index: number;
  onPlay: (track: ITunesTrack, index: number) => void;
  isActive?: boolean;
}

export default function TrackCard({ track, index, onPlay, isActive = false }: TrackCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-[180px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(track, index)}
    >
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden mb-3"
        style={{
          backgroundColor: '#1E1E28',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isHovered
            ? '0 12px 24px rgba(0, 0, 0, 0.4)'
            : '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {track.artworkUrl100 ? (
          <>
            <img
              src={track.artworkUrl100}
              alt={track.trackName}
              className="w-full h-full object-cover"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">&#9835;</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">&#9835;</span>
          </div>
        )}

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            opacity: isHovered || isActive ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 0.3s ease',
            }}
          >
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>

      <div className="px-1">
        <h3
          className="font-semibold text-sm truncate"
          style={{ color: '#F3F4F6' }}
          title={track.trackName}
        >
          {track.trackName}
        </h3>
        <p
          className="text-xs truncate mt-0.5"
          style={{ color: '#9CA3AF' }}
          title={track.artistName}
        >
          {track.artistName}
        </p>
      </div>
    </div>
  );
}
