import React, { useState } from 'react';
import '../../style/PlaylistPost.css'; // Import the CSS file
import { CollectionPostCardProps } from '../../model/post';
import { useNavigate } from 'react-router-dom';

const PlaylistPostCard :React.FC<CollectionPostCardProps> = ({
  post,
  playingTrackId,
  likedTracks,
  onPlayTrack,
  onLike,
  onComment
}) => {


  // Use provided post or default
  const postData = post;

  // State for demo if not provided
  const [localPlayingTrackId, setLocalPlayingTrackId] = useState(null);
  const [localLikedTracks, setLocalLikedTracks] = useState({});

  // Handlers for demo if not provide

  const handleComment = () => {
    if (onComment) {
      onComment();
    } else {
      console.log("Comment clicked");
    }
  };
  const navigate = useNavigate();
  const handleViewDetail = (id : string) => {
    navigate(`/playlist/${id}`);
  };
  // Use provided state or local state
  const currentPlayingTrackId = playingTrackId || localPlayingTrackId;
  const currentLikedTracks = likedTracks || localLikedTracks;

  // Generate formatted date
  const formattedDate = new Date(postData.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // If no content data, return null
  if (!postData.content || !postData.content.songIds) return null;

  return (
    <div className="playlist-card">
      {/* Combined Header and Banner Background */}
      <div 
        className="card-header-banner"
        style={{
          backgroundImage: `url(${postData.content.coverUrl || '/assets/images/default/avatar.jpg'})`
        }}
      >
        {/* Dark overlay gradient */}
        <div className="banner-overlay"></div>
        
        {/* Header content */}
        <div className="header-content">
          <div className="user-info">
            <img
              src={postData.userAvatar || '/assets/images/default/avatar.jpg'}
              alt={postData.username}
              className="user-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
              }}
            />
            <div className="user-details">
              <div className="username">{postData.username}</div>
              <div className="post-date">{formattedDate}</div>
            </div>
          </div>
          <span className="playlist-type">
            {postData.type}
          </span>
        </div>
        
        {/* Banner content */}
        <div className="banner-content">
          <div className="banner-title-area">
            <h2 className="banner-title">{postData.content.title}</h2>
            <div className="banner-meta">
              • {postData.content.songIds.length} tracks
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="flex flex-col md:flex-row" style={{display : "flex"}} onClick={() => handleViewDetail(postData.id)}>
          {/* Album cover */}
          <div className="album-cover-container">
            <div className="album-cover-wrapper">
              <img
                src={postData.content.imageUrl || '/assets/images/default/avatar.jpg'}
                alt={postData.content.title}
                className="album-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
                }}
              />
              <div className="play-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Playlist details */}
          <div className="playlist-details" >
            {/* Tags */}
            <div className="tags-container">
              {postData.content.tags?.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Track list */}
            <div className="tracks-container">
              {postData.content.songIds.map((song, index) => (
                <div key={index} className="track-item">
                  <div className="track-number">{index + 1}</div>
                  <img
                    src={song.imageUrl || '/assets/images/default/track-thumbnail.jpg'}
                    alt={song.title}
                    className="track-thumbnail"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/default/track-thumbnail.jpg';
                    }}
                  />
                  <div className="track-info">
                    <div className="track-title">{song.title}</div>
                    <div className="track-tags">
                      {song.tags?.map((tag, tagIndex) => (
                        <span key={tagIndex} className="track-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="track-play-button"
      
                  >
                    {currentPlayingTrackId === (song.songId || `song-${index}`) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="actions-container">
          <button 
            className={`action-button ${currentLikedTracks[postData.id] ? 'liked' : ''}`}

          >
            <svg xmlns="http://www.w3.org/2000/svg" className="action-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="action-count">{postData.like_count}</span>
          </button>
          <button 
            className="action-button"
            onClick={handleComment}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="action-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="action-count">{postData.comment_count}</span>
          </button>
          <div className="view-display">
            <svg xmlns="http://www.w3.org/2000/svg" className="action-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="action-count">{postData.view_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlaylistPostCard);