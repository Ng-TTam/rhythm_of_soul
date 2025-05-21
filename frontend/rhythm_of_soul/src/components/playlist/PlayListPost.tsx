import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEye } from '@react-icons/all-files/fa/FaEye';


import { PlaylistPostCardProps} from '../../model/post/post';
import styles from '../../styles/PlaylistPost.module.css'; // Updated import
import classNames from 'classnames';

const PlaylistPostCard: React.FC<PlaylistPostCardProps> = ({
  post,
  playingTrackId,
  isLiked,
  onPlayTrack,
  onLike,
  onComment
}) => {
  const navigate = useNavigate();
  const [localLikedTracks, setLocalLikedTracks] = useState<Record<string, boolean>>({});

  if (!post.content) return null;

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const songs = post.content.songIds || [];
  const coverImage = post.content.coverUrl || '/assets/images/default/playlist-cover.jpg';
  const playlistImage = post.content.imageUrl || '/assets/images/default/playlist-thumbnail.jpg';

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
    navigate(`/post/${post.id}`);
  };

  const handleViewDetail = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className={styles['playlist-card']} onClick={handleViewDetail}>
      {/* Header with Banner Background */}
      <div 
        className={styles['card-header-banner']}
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className={styles['banner-overlay']}></div>
        
        <div className={styles['header-content']}>
          <div className={styles['user-info']}>
            <img
              src={post.userAvatar || '/assets/images/default/avatar.jpg'}
              alt={post.username}
              className={styles['user-avatar']}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
              }}
            />
            <div className={styles['user-details']}>
              <div className={styles['username']}>{post.username}</div>
              <div className={styles['post-date']}>{formattedDate}</div>
            </div>
          </div>
          <span className={styles['playlist-type']}>
            {post.type}
          </span>
        </div>
        
        <div className={styles['banner-content']}>
          <div className={styles['banner-title-area']}>
            <h2 className={styles['banner-title']}>{post.content.title}</h2>
            <div className={styles['banner-meta']}>
              • {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles['card-body']}>
        <div className={styles['flex-container']}>
          {/* Album Cover */}
          <div className={styles['album-cover-container']}>
            <div className={styles['album-cover-wrapper']}>
              <img
                src={playlistImage}
                alt={post.content.title}
                className={styles['album-cover']}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/playlist-thumbnail.jpg';
                }}
              />
            </div>
          </div>
          
          {/* Playlist Details */}
          <div className={styles['playlist-details']}>
            {/* Tags */}
            {post.content.tags?.length && post.content.tags.length > 0 && (
              <div className={styles['tags-container']}>
                {post.content.tags.map((tag, index) => (
                  <span key={index} className={styles['tag']}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={styles['actions-container']}>
          <button 
            className={classNames(
              styles['action-button'],
              { [styles['liked']]: isLiked }
            )}
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart className={styles['action-icon']} />
            ) : (
              <FaRegHeart className={styles['action-icon']} />
            )}
            <span className={styles['action-count']}>{post.like_count}</span>
          </button>
          <button 
            className={styles['action-button']}
            onClick={handleComment}
          >
            <FaComment className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.comment_count}</span>
          </button>
          <div className={styles['view-display']}>
            <FaEye className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.view_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlaylistPostCard);