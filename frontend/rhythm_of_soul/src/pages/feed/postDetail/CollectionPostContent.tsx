import React from 'react';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaListUl } from '@react-icons/all-files/fa/FaListUl';
import { PostType } from '../../../model/post';

interface CollectionPostContentProps {
  content: {
    title?: string;
    imageUrl?: string;
    songIds?: Array<{
      title: string;
      mediaUrl?: string;
      imageUrl?: string;
      tags?: string[];
      songId?: string;
    }>;
  };
  type: PostType;
  playingTrackId: string | null;
  onPlayPause: (trackId: string, mediaUrl?: string) => void;
}

const CollectionPostContent: React.FC<CollectionPostContentProps> = ({
  content,
  type,
  playingTrackId,
  onPlayPause
}) => (
  <div className="collection-post-content">
  <div className="collection-header">
    {content.imageUrl ? (
      <img 
        src={content.imageUrl} 
        alt={content.title || 'Collection cover'} 
        className="collection-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'default-cover.png';
        }}
      />
    ) : (
      <div className="collection-cover placeholder" />
    )}
    <div className="collection-info">
      <h3>{content.title || 'Untitled Collection'}</h3>
      <div className="collection-meta">
        <span className="type-badge">
          {type === 'ALBUM' ? <FaMusic /> : <FaListUl />}
          {type}
        </span>
        <span>{content.songIds?.length || 0} tracks</span>
      </div>
    </div>
  </div>
  
  {content.songIds?.length ? (
    <div className="track-list">
      {content.songIds.map((song, index) => (
        <div key={song.songId} className="track-item">
          <div className="track-number">{index + 1}</div>
          {song.imageUrl ? (
            <img 
              src={song.imageUrl} 
              alt={`${song.title} cover`} 
              className="track-thumbnail"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'default-track.png';
              }}
            />
          ) : (
            <div className="track-thumbnail placeholder" />
          )}
          <div className="track-info">
            <div className="track-title">{song.title}</div>
            {song.tags?.length ? (
              <div className="track-tags">
                {song.tags.map((tag, i) => (
                  <span key={i} className="tag">#{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
          <button 
            className={`play-btn ${playingTrackId === song.songId ? 'playing' : ''}`}
            onClick={() => onPlayPause(song.songId || '', song.mediaUrl)}
            aria-label={playingTrackId === song.songId ? 'Pause track' : 'Play track'}
          >
            {playingTrackId === song.songId ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="empty-track-list">No tracks in this collection</div>
  )}
</div>
);

export default React.memo(CollectionPostContent);