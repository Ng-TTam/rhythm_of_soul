import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useAppDispatch, useAppSelector } from '../../store/hook';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsX } from '@react-icons/all-files/bs/BsX';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { playNextSong, playPreviousSong, playSingleSong, toggleePlay, toggleRepeatMode, toggleShuffle } from "../../reducers/audioReducer";
interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
}

const StreamingPlaybackBar: React.FC = () => {
  // Redux state
  const {
    play,
    currentSong,
    playlist,
    repeatMode,
    shuffle,
    imageSong,
    titleSong,
    artistSong,
    mediaUrlSong
  } = useAppSelector(state => state.audio);
  const dispatch = useAppDispatch();

  // Player state
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadedRanges, setLoadedRanges] = useState<TimeRanges | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // API config
  const API_BASE_URL = "http://localhost:8484/content/api/audio";
  const audioUrl = (currentSong as any)?.audioUrl || `${API_BASE_URL}/${mediaUrlSong}`;

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Toggle play/pause - ĐÃ SỬA
  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (play) {
        await audioRef.current.pause();
      } else {
        // Chỉ reset về đầu nếu bài đã kết thúc
        if (audioRef.current.currentTime >= audioRef.current.duration - 0.1) {
          audioRef.current.currentTime = 0;
        }
        await audioRef.current.play();
      }
      dispatch(toggleePlay(!play));
    } catch (error) {
      console.error("Playback error:", error);
    }
  }, [play, dispatch]);

  // Thêm effect đồng bộ trạng thái phát - MỚI THÊM
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (play && audio.paused) {
      audio.play().catch(console.error);
    } else if (!play && !audio.paused) {
      audio.pause();
    }
  }, [play]);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Progress bar handlers
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressContainerRef.current && audioRef.current) {
      const bounds = progressContainerRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - bounds.left;
      const percentage = clickPosition / bounds.width;
      const newTime = percentage * duration;

      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  }, [duration]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    if (audioRef.current?.paused === false) {
      audioRef.current.pause();
    }
    handleProgressClick(e);
  }, [handleProgressClick]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && audioRef.current) {
      setIsDragging(false);
      if (play) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isDragging, play]);

  // Skip tracks
  const skipForward = useCallback(() => {
    if (playlist) {
      dispatch(playNextSong());
    } else if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration, playlist, dispatch]);

  const skipBackward = useCallback(() => {
    if (playlist) {
      dispatch(playPreviousSong());
    } else if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [playlist, dispatch]);

  // Update audio element when song changes - ĐÃ SỬA
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleCanPlay = () => {
      setIsBuffering(false);
      if (play) {
        audio.play().catch(error => {
          console.error("Autoplay failed:", error);
          dispatch(toggleePlay(false));
        });
      }
    };

    // Giữ nguyên currentTime khi thay đổi bài hát
    const prevTime = audio.currentTime;
    audio.src = audioUrl;
    audio.load();
    audio.currentTime = prevTime;

    audio.addEventListener('canplay', handleCanPlay);
    setIsBuffering(true);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, play, dispatch]);

  // Audio event listeners - ĐÃ SỬA
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        dispatch(playNextSong());
      }
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setLoadedRanges(audio.buffered);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('progress', handleProgress);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('progress', handleProgress);
    };
  }, [isDragging, repeatMode, dispatch]);

  // Global mouse events for seek
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressContainerRef.current && audioRef.current) {
        const bounds = progressContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
        const percentage = x / bounds.width;
        const newTime = percentage * duration;
        setCurrentTime(newTime);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, handleMouseUp]);

  // Calculate buffered regions
  const getBufferedRegions = useCallback(() => {
    if (!loadedRanges || !duration) return [];

    return Array.from({ length: loadedRanges.length }, (_, i) => ({
      start: (loadedRanges.start(i) / duration) * 100,
      end: (loadedRanges.end(i) / duration) * 100
    }));
  }, [loadedRanges, duration]);

  const bufferedRegions = getBufferedRegions();
  const currentTrack = currentSong || {
    id: 'legacy',
    title: titleSong,
    artist: artistSong,
    imageUrl: imageSong,
    audioUrl: `${API_BASE_URL}/${mediaUrlSong}`
  };

  return (
    <div className="music-player-container">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
      />

      {/* Playlist Modal */}
      {showPlaylist && playlist && (
        <div className="playlist-modal bg-dark text-white p-3">
          <div className="d-flex justify-content-between mb-3">
            <h5>Playlist ({playlist.songs.length} tracks)</h5>
            <button
              className="btn btn-link text-white"
              onClick={() => setShowPlaylist(false)}
            >
              <BsX size={24} />
            </button>
          </div>
          <ul className="list-group">
            {playlist.songs.map((song, index) => (
              <li
                key={song.id}
                className={`list-group-item bg-${currentSong?.id === song.id ? 'primary' : 'dark'
                  } text-white d-flex justify-content-between align-items-center`}
                onClick={() => {
                  dispatch(playSingleSong(song));
                  setShowPlaylist(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>{song.title}</strong>
                  <div className="text-muted">{song.artist}</div>
                </div>
                {currentSong?.id === song.id && <BsPlayFill />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Player Controls */}
      <footer className="fixed-bottom bg-dark">
        {/* Progress bar */}
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
            />
          </div>

          {/* Seek handle */}
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
          />
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
                    backgroundImage: `url(${currentTrack.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="track-info">
                  <h6 className="text-white mb-0">{currentTrack.title}</h6>
                  <small className="text-secondary">{currentTrack.artist}</small>
                </div>
                <button
                  className={`btn btn-link text-${isFavorite ? 'danger' : 'white'} ms-3`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? <BsHeartFill size={18} /> : <BsHeart size={18} />}
                </button>
              </div>
            </div>

            {/* Main controls */}
            <div className="col-md-6">
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className={`btn btn-link text-${shuffle ? 'primary' : 'white'} mx-2`}
                  onClick={() => dispatch(toggleShuffle())}
                  aria-label="Shuffle"
                >
                  <BsShuffle size={18} />
                </button>
                <button className="btn btn-link text-white mx-2" onClick={skipBackward}>
                  <BsSkipBackwardFill size={20} />
                </button>
                <button
                  className="btn btn-primary rounded-circle p-2 mx-3"
                  onClick={togglePlay}
                  aria-label={play ? "Pause" : "Play"}
                  disabled={!currentSong && !mediaUrlSong} // Vô hiệu hóa nếu không có dữ liệu
                >
                  {(!currentSong && !mediaUrlSong) ? (
                    <BsMusicNoteList size={24} /> // Icon "không có bài hát"
                  ) : isBuffering ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : play ? (
                    <BsPauseFill size={24} />
                  ) : (
                    <BsFillPlayFill size={24} />
                  )}
                </button>
                <button className="btn btn-link text-white mx-2" onClick={skipForward}>
                  <BsSkipForwardFill size={20} />
                </button>
                <button
                  className={`btn btn-link text-${repeatMode === 'one' ? 'primary' :
                      repeatMode === 'all' ? 'info' : 'white'
                    } mx-2`}
                  onClick={() => dispatch(toggleRepeatMode())}
                  aria-label={`Repeat ${repeatMode}`}
                >
                  {repeatMode === 'one' ? <BsReply size={18} /> : <BsReply size={18} />}
                </button>
              </div>
            </div>

            {/* Right controls */}
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-end">
                {isBuffering && (
                  <div className="buffering-indicator text-white me-3">
                    <BsCloudDownload size={16} className="me-1" />
                    <small>Buffering...</small>
                  </div>
                )}

                <div className="volume-control d-flex align-items-center me-3">
                  <button
                    className="btn btn-link text-white p-0 me-2"
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <BsVolumeMute size={20} /> : <BsVolumeUp size={20} />}
                  </button>
                  <input
                    type="range"
                    className="form-range"
                    style={{ width: '80px' }}
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>

                <div className="time-display text-white me-3">
                  <small>{formatTime(currentTime)} / {formatTime(duration)}</small>
                </div>

                <div className="additional-controls d-flex">
                  <button
                    className={`btn btn-link text-${showPlaylist ? 'primary' : 'secondary'
                      } me-2`}
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    disabled={!playlist}
                    aria-label="Show playlist"
                  >
                    <BsMusicNoteList size={18} />
                  </button>
                  <button
                    className="btn btn-link text-secondary"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <BsFullscreenExit size={18} /> : <BsFullscreen size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .music-player-container {
          position: relative;
          z-index: 1000;
          margin-top :80px;
        }
        
        .playlist-modal {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          z-index: 1001;
        }
        
        .list-group-item {
          border-color: rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        
        .list-group-item:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }
        
        .btn:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        
        .btn-primary {
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
          min-width: 40px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-primary:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(13, 110, 253, 0.7);
        }
        
        .track-art {
          transition: all 0.3s ease;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .progress {
          background-color: rgba(255, 255, 255, 0.2);
          transition: height 0.2s ease;
        }
        
        .progress-container:hover .progress {
          height: 8px !important;
        }
        
        .seek-handle {
          will-change: left;
          transition: transform 0.2s ease;
        }
        
        .progress-container:hover .seek-handle {
          transform: scale(1.2);
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
      `}</style>
    </div>
  );
};

export default StreamingPlaybackBar;
