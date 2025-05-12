import React from 'react';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';

import { formatTime } from '../../../model/post';

interface SongPostContentProps {
  content: {
    title?: string;
    mediaUrl?: string;
    imageUrl?: string;
    tags?: string[];
  };
  postId: string;
  playingTrackId: string | null;
  audioPosition: number;
  audioProgress: number;
  onPlayPause: (trackId: string, mediaUrl?: string) => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>, duration: number) => void;
  audioDuration: number;
}

const SongPostContent: React.FC<SongPostContentProps> = ({
  content,
  postId,
  playingTrackId,
  audioPosition,
  audioProgress,
  onPlayPause,
  onSeek,
  audioDuration
}) => (
  <div className="song-post-content">
    <div className="song-player">
      <img 
        src={content.imageUrl} 
        alt={content.title} 
        className="song-cover"
      />
      <div className="song-info">
        <h3>{content.title}</h3>
        <div className="song-tags">
          {content.tags?.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>
        <div className="audio-controls">
          <button 
            className={`play-btn ${playingTrackId === postId ? 'playing' : ''}`}
            onClick={() => onPlayPause(postId, content.mediaUrl)}
          >
            {playingTrackId === postId ? <FaPause /> : <FaPlay />}
          </button>
          <div className="progress-container" onClick={(e) => onSeek(e, audioDuration)}>
            <div 
              className="progress-bar" 
              style={{ width: `${audioProgress}%` }}
            ></div>
          </div>
          <span className="time">{formatTime(audioPosition)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(SongPostContent);