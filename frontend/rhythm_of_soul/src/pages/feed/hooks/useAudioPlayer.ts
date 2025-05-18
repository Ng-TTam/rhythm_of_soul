import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState({
    position: 0,
    progress: 0,
    duration: 180,
    playingTrackId: null as string | null
  });

  const updateAudioProgress = useCallback(() => {
    if (audioRef.current) {
      const position = audioRef.current.currentTime;
      const progress = (position / audioRef.current.duration) * 100;
      setAudioState(prev => ({ ...prev, position, progress }));
    }
  }, []);

  const handlePlayPause = useCallback((trackId: string, mediaUrl?: string) => {
    if (!audioRef.current) return;

    if (audioState.playingTrackId === trackId) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, playingTrackId: null }));
    } else {
      if (mediaUrl && audioRef.current.src !== mediaUrl) {
        audioRef.current.src = mediaUrl;
        audioRef.current.load();
      }
      audioRef.current.play()
        .then(() => setAudioState(prev => ({ ...prev, playingTrackId: trackId })))
        .catch(err => console.error('Error playing audio:', err));
    }
  }, [audioState.playingTrackId]);

  const seekAudio = useCallback((e: React.MouseEvent<HTMLDivElement>, duration: number) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newPosition = clickPosition * duration;
    
    audioRef.current.currentTime = newPosition;
    setAudioState(prev => ({
      ...prev,
      position: newPosition,
      progress: clickPosition * 100
    }));
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', updateAudioProgress);
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setAudioState(prev => ({ ...prev, duration: audioRef.current?.duration || 180 }));
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateAudioProgress);
        audioRef.current = null;
      }
    };
  }, [updateAudioProgress]);

  return {
    audioState,
    handlePlayPause,
    seekAudio
  };
};