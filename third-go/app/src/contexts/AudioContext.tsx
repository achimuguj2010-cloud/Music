import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import type { JamendoTrack } from '@/services/jamendoApi';

interface AudioContextType {
  audio: HTMLAudioElement;
  currentTrack: JamendoTrack | null;
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isLiked: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  tracks: JamendoTrack[];
  playTrack: (track: JamendoTrack, index: number, trackList?: JamendoTrack[]) => void;
  playTrackByIndex: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: () => void;
  seekTo: (percentage: number) => void;
  setVolumeLevel: (level: number) => void;
  setTracks: (tracks: JamendoTrack[]) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [currentTrack, setCurrentTrack] = useState<JamendoTrack | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);

  const audio = audioRef.current;
  audio.volume = volume;

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, isRepeat, tracks, isShuffle, currentIndex]);

  const playTrack = useCallback((track: JamendoTrack, index: number, trackList?: JamendoTrack[]) => {
    if (trackList) {
      setTracks(trackList);
    }
    setCurrentIndex(index);
    setCurrentTrack(track);
    audio.src = track.audio;
    audio.play().catch(() => {});
    setIsPlaying(true);
    setIsLiked(false);
  }, [audio]);

  const playTrackByIndex = useCallback((index: number) => {
    if (index < 0 || index >= tracks.length) return;
    const track = tracks[index];
    setCurrentIndex(index);
    setCurrentTrack(track);
    audio.src = track.audio;
    audio.play().catch(() => {});
    setIsPlaying(true);
    setIsLiked(false);
  }, [audio, tracks]);

  const togglePlay = useCallback(() => {
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audio, isPlaying]);

  const handleNextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
    } else {
      nextIdx = currentIndex + 1;
      if (nextIdx >= tracks.length) nextIdx = 0;
    }
    playTrackByIndex(nextIdx);
  }, [tracks, isShuffle, currentIndex, playTrackByIndex]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    let prevIdx: number;
    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * tracks.length);
    } else {
      prevIdx = currentIndex - 1;
      if (prevIdx < 0) prevIdx = tracks.length - 1;
    }
    playTrackByIndex(prevIdx);
  }, [tracks, isShuffle, currentIndex, playTrackByIndex]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat(prev => !prev);
  }, []);

  const toggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const seekTo = useCallback((percentage: number) => {
    if (!audio.duration) return;
    audio.currentTime = percentage * audio.duration;
  }, [audio]);

  const setVolumeLevel = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(1, level));
    setVolume(clamped);
    audio.volume = clamped;
  }, [audio]);

  return (
    <AudioContext.Provider
      value={{
        audio,
        currentTrack,
        currentIndex,
        isPlaying,
        isShuffle,
        isRepeat,
        isLiked,
        currentTime,
        duration,
        volume,
        tracks,
        playTrack,
        playTrackByIndex,
        togglePlay,
        nextTrack: handleNextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        seekTo,
        setVolumeLevel,
        setTracks,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
