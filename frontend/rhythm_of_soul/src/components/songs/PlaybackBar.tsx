import React, { useState, useRef, useEffect } from "react";
import { BsFillPlayFill } from '@react-icons/all-files/bs/BsFillPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsSkipBackwardFill } from '@react-icons/all-files/bs/BsSkipBackwardFill';
import { BsSkipForwardFill } from '@react-icons/all-files/bs/BsSkipForwardFill';
import { BsShuffle } from '@react-icons/all-files/bs/BsShuffle';
import { BsReply } from '@react-icons/all-files/bs/BsReply';
import { BsHeart } from '@react-icons/all-files/bs/BsHeart';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { BsVolumeUp } from '@react-icons/all-files/bs/BsVolumeUp';
import { BsVolumeMute } from '@react-icons/all-files/bs/BsVolumeMute';
import { BsFullscreen } from '@react-icons/all-files/bs/BsFullscreen';
import { BsFullscreenExit } from '@react-icons/all-files/bs/BsFullscreenExit';
import { BsMusicNoteList } from '@react-icons/all-files/bs/BsMusicNoteList';
import { BsCloudDownload } from '@react-icons/all-files/bs/BsCloudDownload';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function StreamingPlaybackBar() {
  // State for player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadedRanges, setLoadedRanges] = useState<TimeRanges | null>(null);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);
  
  // API endpoint constants
  const API_BASE_URL = "http://localhost:8484/api/audio";
  const AUDIO_FILENAME = "20bd8ab7-1cc9-45bc-ab45-47dde98512cc_a1loax01.mp3";
  const audioUrl = `${API_BASE_URL}/${AUDIO_FILENAME}`;
  
  const [currentTrack, setCurrentTrack] = useState({
    name: "Demo Track",
    artist: "Demo Artist",
    cover: "https://via.placeholder.com/60"
  });

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef(null);

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsBuffering(true);
        audioRef.current?.play().catch(error => {
          console.error("Audio playback failed:", error);
          setIsBuffering(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted) {
        setVolume(80); // Restore previous volume
        audioRef.current.volume = 0.8;
      } else {
        setVolume(0);
        audioRef.current.volume = 0;
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Implementation would depend on your app's layout
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Format time in MM:SS
  const formatTime = (seconds :number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressContainerRef.current && audioRef.current) {
      // Store current playing state before seeking
      setWasPlayingBeforeSeek(isPlaying);
      
      // Pause audio temporarily during seek to prevent stuttering
      if (isPlaying) {
        audioRef.current.pause();
      }
      
      const bounds = progressContainerRef.current.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const width = bounds.width;
      const percentage = x / width;
      const newTime = percentage * duration;
      
      setCurrentTime(() => newTime);
      audioRef.current.currentTime = newTime;
      
      // Resume playback if it was playing before
      if (wasPlayingBeforeSeek) {
        setTimeout(() => {
          audioRef.current?.play().catch(error => {
            console.error("Failed to resume playback after seeking:", error);
          });
        }, 50); // Small delay to allow the browser to catch up
      }
    }
  };

  // Handle mouse down (start dragging)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Store if audio was playing before starting to drag
    setWasPlayingBeforeSeek(isPlaying);
    
    // Pause while dragging to prevent stuttering
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    handleProgressClick(e);
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move while dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && progressContainerRef.current && audioRef.current) {
      const bounds = progressContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
      const percentage = x / bounds.width;
      const newTime = percentage * duration;
      
      setCurrentTime(newTime);
      // Don't update audio.currentTime until mouse is released for smoother dragging
    }
  };

  // Handle mouse up (end dragging)
  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging && audioRef.current) {
      // Set final position when dragging ends
      audioRef.current.currentTime = currentTime;
      setIsDragging(false);
      
      // Resume playback if it was playing before dragging started
      if (wasPlayingBeforeSeek) {
        audioRef.current.play().catch(error => {
          console.error("Failed to resume playback after dragging:", error);
        });
        setIsPlaying(true);
      }
      
      // Remove global event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Skip forward
  const skipForward = () => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      
      // Update state and audio position
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
      
      // If it was playing, make sure it continues playing
      if (wasPlaying && !(audioRef.current.paused || audioRef.current.currentTime === 0)) {
        audioRef.current.play().catch(error => {
          console.error("Failed to resume playback after skip forward:", error);
        });
      }
    }
  };

  // Skip backward
  const skipBackward = () => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      
      // Update state and audio position
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
      
      // If it was playing, make sure it continues playing
      if (wasPlaying && !(audioRef.current.paused || audioRef.current.currentTime === 0)) {
        audioRef.current.play().catch(error => {
          console.error("Failed to resume playback after skip backward:", error);
        });
      }
    }
  };

  // Handle canplay event - ready to play without buffering
  const handleCanPlay = () => {
    setIsBuffering(false);
    
    // If wasPlayingBeforeSeek is true, we should resume playback
    if (wasPlayingBeforeSeek && !isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Failed to resume playback after buffering:", error);
      });
      setIsPlaying(true);
    }
  };

  // Update audio player UI based on audio element events
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set initial volume
      audio.volume = volume / 100;
      audio.muted = isMuted;
      
      // Event handlers
      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsBuffering(false);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handlePlaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };
      
      const handleProgress = () => {
        // Update buffer information
        if (audio.buffered.length > 0) {
          setLoadedRanges(audio.buffered);
        }
      };
      
      const handleCanPlayEvent = () => {
        setIsBuffering(false);
        // If wasPlayingBeforeSeek is true, resume playback
        if (wasPlayingBeforeSeek && !isPlaying) {
          audio.play().catch(error => {
            console.error("Failed to resume playback:", error);
          });
          setIsPlaying(true);
          setWasPlayingBeforeSeek(false); // Reset flag after handling
        }
      };
      
      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('progress', handleProgress);
      audio.addEventListener('canplay', handleCanPlayEvent);
      audio.addEventListener('seeked', () => {
        // When seeking completes, if it was playing before, resume
        if (wasPlayingBeforeSeek) {
          audio.play().catch(err => console.error("Failed to play after seek:", err));
          setIsPlaying(true);
        }
      });
      
      // Clean up event listeners
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('progress', handleProgress);
        audio.removeEventListener('canplay', handleCanPlayEvent);
        audio.removeEventListener('seeked', () => {});
      };
    }
  }, [volume, isMuted, isDragging, wasPlayingBeforeSeek, isPlaying]);

  // Calculate buffered regions for display
  const getBufferedRegions = () => {
    if (!loadedRanges || !duration) return [];
    
    const regions = [];
    for (let i = 0; i < loadedRanges.length; i++) {
      const start = (loadedRanges.start(i) / duration) * 100;
      const end = (loadedRanges.end(i) / duration) * 100;
      regions.push({ start, end });
    }
    return regions;
  };

  const bufferedRegions = getBufferedRegions();

  return (
    <div className="music-player-container">
      {/* Audio element - using native browser Range request capabilities */}
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        preload="auto"
        onCanPlay={handleCanPlay}
      />
      
      <footer className="fixed-bottom bg-dark">
        {/* Improved Progress bar with buffer indicators */}
        <div 
          ref={progressContainerRef}
          className="progress-container position-relative" 
          style={{ height: '15px', cursor: 'pointer', padding: '5px 0' }}
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
        >
          {/* Buffer indicators */}
          <div className="buffer-regions position-absolute" style={{ width: '100%', height: '5px', top: '5px' }}>
            {bufferedRegions.map((region, idx) => (
              <div 
                key={idx}
                className="buffer-region bg-secondary opacity-50"
                style={{
                  position: 'absolute',
                  left: `${region.start}%`,
                  width: `${region.end - region.start}%`,
                  height: '100%'
                }}
              />
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="progress" style={{ height: '5px', position: 'relative', zIndex: 1 }}>
            <div 
              className="progress-bar bg-primary" 
              role="progressbar" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
              aria-valuenow={currentTime} 
              aria-valuemin={0} 
              aria-valuemax={duration}
            ></div>
          </div>
          
          {/* Visible seek handle */}
          <div 
            className="seek-handle" 
            style={{ 
              position: 'absolute',
              left: `calc(${(currentTime / duration) * 100}% - 6px)`,
              top: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0d6efd',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
              transition: isDragging ? 'none' : 'left 0.1s ease',
              zIndex: 2
            }}
          ></div>
          
          {/* Time tooltip when hovering */}
          <div 
            className="time-tooltip" 
            style={{ 
              position: 'absolute',
              left: `${(currentTime / duration) * 100}%`,
              top: '-20px',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px',
              opacity: isDragging ? 1 : 0,
              zIndex: 3
            }}
          >
            {formatTime(currentTime)}
          </div>
        </div>
        
        {/* Player controls */}
        <div className="container-fluid py-2">
          <div className="row align-items-center">
            {/* Track info */}
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <div 
                  className="track-art me-3 rounded" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    backgroundImage: `url(${currentTrack.cover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="track-info">
                  <h6 className="text-white mb-0 track-name">{currentTrack.name}</h6>
                  <small className="text-secondary track-artist">{currentTrack.artist}</small>
                </div>
                <button 
                  className={`btn btn-link text-${isFavorite ? 'danger' : 'white'} ms-3`}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? <BsHeartFill size={18} /> : <BsHeart size={18} />}
                </button>
              </div>
            </div>
            
            {/* Controls */}
            <div className="col-md-6">
              <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-link text-white mx-2 btn-control" onClick={() => {}}>
                  <BsShuffle size={18} />
                </button>
                <button className="btn btn-link text-white mx-2 btn-control" onClick={skipBackward}>
                  <BsSkipBackwardFill size={20} />
                </button>
                <button 
                  className="btn btn-primary rounded-circle p-2 mx-3 btn-play-pause" 
                  onClick={togglePlay}
                >
                  {isBuffering ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : isPlaying ? <BsPauseFill size={24} /> : <BsFillPlayFill size={24} />}
                </button>
                <button className="btn btn-link text-white mx-2 btn-control" onClick={skipForward}>
                  <BsSkipForwardFill size={20} />
                </button>
                <button className="btn btn-link text-white mx-2 btn-control" onClick={() => {}}>
                  <BsReply size={18} />
                </button>
              </div>
            </div>
            
            {/* Volume and time */}
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-end">
                {/* Buffer indicator */}
                {isBuffering && (
                  <div className="buffering-indicator text-white me-3">
                    <BsCloudDownload size={16} className="me-1" />
                    <small>Buffering...</small>
                  </div>
                )}
                
                {/* Volume control */}
                <div className="volume-control d-flex align-items-center me-3">
                  <button className="btn btn-link text-white p-0 me-2 btn-control" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <BsVolumeMute size={20} /> : <BsVolumeUp size={20} />}
                  </button>
                  <input
                    type="range"
                    ref={volumeSliderRef}
                    className="form-range"
                    style={{ width: '80px' }}
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
                
                {/* Time display */}
                <div className="time-display text-white me-3">
                  <small>{formatTime(currentTime)} / {formatTime(duration)}</small>
                </div>
                
                {/* Additional controls */}
                <div className="additional-controls d-flex">
                  <button className="btn btn-link text-secondary me-2 btn-control">
                    <BsMusicNoteList size={18} />
                  </button>
                  <button 
                    className="btn btn-link text-secondary btn-control" 
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <BsFullscreenExit size={18} /> : <BsFullscreen size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS for animations and effects */}
      <style>{`
        .btn-control:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        
        .btn-play-pause {
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
          min-width: 40px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-play-pause:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(13, 110, 253, 0.7);
        }
        
        .track-art {
          transition: all 0.3s ease;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .track-art:hover {
          transform: scale(1.05);
        }
        
        .progress {
          background-color: rgba(255, 255, 255, 0.2);
          transition: height 0.2s ease;
        }
        
        .progress-container:hover .progress {
          height: 8px !important;
        }
        
        .progress-container:hover .seek-handle {
          transform: scale(1.2);
        }
        
        .seek-handle {
          transition: transform 0.2s ease;
        }
        
        .progress-container:hover .time-tooltip {
          opacity: 1;
        }
        
        .buffering-indicator {
          display: flex;
          align-items: center;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .form-range::-webkit-slider-thumb {
          background: #0d6efd;
        }
        
        .form-range::-moz-range-thumb {
          background: #0d6efd;
        }
        
        .form-range::-ms-thumb {
          background: #0d6efd;
        }
      `}</style>
    </div>
  );
}