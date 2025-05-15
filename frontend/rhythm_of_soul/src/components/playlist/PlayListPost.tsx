import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEye } from '@react-icons/all-files/fa/FaEye';


import { CollectionPostCardProps } from '../../model/post';
import '../../style/PlaylistPost.css';
import classNames from 'classnames/bind';
const PlaylistPostCard: React.FC<CollectionPostCardProps> = ({
  post,
  playingTrackId,
  likedTracks,
  onPlayTrack,
  onLike,
  onComment
}) => {
  const navigate = useNavigate();
  const cx = classNames.bind(require('../../style/PlaylistPost.css'));
  // Local state fallbacks
  const [localPlayingTrackId, setLocalPlayingTrackId] = useState<string | null>(null);
  const [localLikedTracks, setLocalLikedTracks] = useState<Record<string, boolean>>({});
  
  // Use provided state or local state
  const currentPlayingTrackId = playingTrackId || localPlayingTrackId;
  const currentLikedTracks = likedTracks || localLikedTracks;

  if (!post.content) return null;

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const songs = post.content.songIds || [];
  const isLiked = currentLikedTracks[post.id];
  const coverImage = post.content.coverUrl || '/assets/images/default/playlist-cover.jpg';
  const playlistImage = post.content.imageUrl || '/assets/images/default/playlist-thumbnail.jpg';

  const handleTrackPlay = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayTrack) {
      onPlayTrack(trackId);
    } else {
      setLocalPlayingTrackId(prev => prev === trackId ? null : trackId);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike();
    } else {
      setLocalLikedTracks(prev => ({
        ...prev,
        [post.id]: !prev[post.id]
      }));
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComment) {
      onComment();
    }
  };

  const handleViewDetail = () => {
    navigate(`/playlist/${post.id}`);
  };

  return (
    <div className={cx("playlist-card",classNames)} onClick={handleViewDetail}>
      {/* Header with Banner Background */}
      <div 
        className="card-header-banner"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="banner-overlay"></div>
        
        <div className="header-content">
          <div className="user-info">
            <img
              src={post.userAvatar || '/assets/images/default/avatar.jpg'}
              alt={post.username}
              className="user-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
              }}
            />
            <div className="user-details">
              <div className="username">{post.username}</div>
              <div className="post-date">{formattedDate}</div>
            </div>
          </div>
          <span className="playlist-type">
            {post.type}
          </span>
        </div>
        
        <div className="banner-content">
          <div className="banner-title-area">
            <h2 className="banner-title">{post.content.title}</h2>
            <div className="banner-meta">
              • {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="flex-container">
          {/* Album Cover */}
          <div className="album-cover-container">
            <div className="album-cover-wrapper">
              <img
                src={playlistImage}
                alt={post.content.title}
                className="album-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/playlist-thumbnail.jpg';
                }}
              />
            </div>
          </div>
          
          {/* Playlist Details */}
          <div className="playlist-details">
            {/* Tags */}
            {post.content.tags?.length && post.content.tags.length > 0 && (
              <div className="tags-container">
                {post.content.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="actions-container">
          <button 
            className={`action-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart className="action-icon" />
            ) : (
              <FaRegHeart className="action-icon" />
            )}
            <span className="action-count">{post.like_count}</span>
          </button>
          <button 
            className="action-button"
            onClick={handleComment}
          >
            <FaComment className="action-icon" />
            <span className="action-count">{post.comment_count}</span>
          </button>
          <div className="view-display">
            <FaEye className="action-icon" />
            <span className="action-count">{post.view_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlaylistPostCard);