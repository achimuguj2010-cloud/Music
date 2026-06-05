import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useAudio } from '@/contexts/AudioContext';
import type { ITunesTrack } from '@/services/itunesApi';
import { fetchTrendingTracks, fetchChillTracks } from '@/services/itunesApi';
import TrackCard from '@/components/TrackCard';
import HeroVisualizer from '@/components/HeroVisualizer';

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      className="text-xl font-semibold mb-5"
      style={{ color: '#F3F4F6' }}
    >
      {title}
    </h2>
  );
}

function TrackSection({
  title,
  tracks,
  onPlayTrack,
  sectionRef,
  currentTrackId,
}: {
  title: string;
  tracks: ITunesTrack[];
  onPlayTrack: (track: ITunesTrack, index: number) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  currentTrackId?: string;
}) {
  return (
    <div ref={sectionRef} className="mb-10">
      <SectionHeader title={title} />
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlayTrack}
            isActive={currentTrackId === track.id}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { playTrack, currentTrack, setTracks } = useAudio();
  const [trending, setTrending] = useState<ITunesTrack[]>([]);
  const [chill, setChill] = useState<ITunesTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const trendingRef = useRef<HTMLDivElement>(null);
  const chillRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [trendingData, chillData] = await Promise.all([
          fetchTrendingTracks(12),
          fetchChillTracks(12),
        ]);
        setTrending(trendingData);
        setChill(chillData);

        // Set tracks for player navigation
        const allTracks = [...trendingData, ...chillData];
        setTracks(allTracks);
      } catch (err) {
        setError('Failed to load tracks. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setTracks]);

  // GSAP entrance animations
  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline();

    if (heroRef.current) {
      tl.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (trendingRef.current) {
      tl.from(
        trendingRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

    if (chillRef.current) {
      tl.from(
        chillRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

    return () => {
      tl.kill();
    };
  }, [loading]);

  const handlePlayTrack = (track: ITunesTrack, index: number) => {
    // Determine which list this track belongs to
    const trendingIndex = trending.findIndex(t => t.id === track.id);
    if (trendingIndex !== -1) {
      playTrack(track, trendingIndex, trending);
      return;
    }
    const chillIndex = chill.findIndex(t => t.id === track.id);
    if (chillIndex !== -1) {
      playTrack(track, chillIndex, chill);
      return;
    }
    playTrack(track, index, [...trending, ...chill]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-2" style={{ color: '#EF4444' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#fff',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div ref={heroRef}>
        <HeroVisualizer />
      </div>

      {/* Trending */}
      <TrackSection
        title="Trending Now"
        tracks={trending}
        onPlayTrack={handlePlayTrack}
        sectionRef={trendingRef}
        currentTrackId={currentTrack?.id}
      />

      {/* Made For You */}
      <TrackSection
        title="Made For You"
        tracks={chill}
        onPlayTrack={handlePlayTrack}
        sectionRef={chillRef}
        currentTrackId={currentTrack?.id}
      />
    </div>
  );
}
