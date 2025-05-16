import React from 'react';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SongPostCardProps } from '../../model/post/post';
import '../../style/SongPostCard.css'; // We'll create this CSS file
import classNames from 'classnames/bind';

const SongPostCard: React.FC<SongPostCardProps> = ({ 
  post, 
  isPlaying, 
  isLiked, 
  onPlay, 
  onLike, 
  onComment 
}) => {
  const navigate = useNavigate();
  const cx = classNames.bind(require('../../style/SongPostCard.css'));
  if (!post.content) return null;
  
  // Giữ nguyên imageUrl cho ảnh chính
  const songImage = post.content.imageUrl || '/assets/images/default/music-thumbnail.jpg';
  // Sử dụng coverUrl làm background nếu có
  const hasCover = post.content.coverUrl;

  return (
    <Card className={cx(`song-post-card ${hasCover ? 'with-cover' : ''}`,classNames)} >
      {/* Background cover (chỉ hiển thị nếu có coverUrl) */}
      {hasCover && (
        <div 
          className="cover_background"
          style={{ backgroundImage: `url(${post.content.coverUrl})` }}
        />
      )}
      
      <Card.Header className="post-header" style={{background :"none"}}>
        <div className="user-info">
          <img
            src={post.userAvatar || '/assets/images/default/avatar.jpg'}
            alt={post.username}
            className="user-avatar"
          />
          <div className="user-details">
            <span className="username">{post.username}</span>
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button variant="link" className="post-options">
          <FaEllipsisH />
        </Button>
      </Card.Header>
      
      <Card.Body className="post-content">
        <div className="song-media">
          {/* Vẫn sử dụng imageUrl như cũ cho ảnh chính */}
          <img
            src={songImage}
            alt={post.content.title}
            className="song-thumbnail"
            onClick={() => navigate(`/songs/${post.id}`)}
          />
          
          <div className="song-info">
            <h3 className="song-title">{post.content.title}</h3>
            
            {post.caption && (
              <p className="song-caption">{post.caption}</p>
            )}
            
            <div className="player-controls">
              <Button 
                variant={isPlaying ? "danger" : "primary"} 
                className="play-btn"
                onClick={onPlay}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              
              <div className="progress-container">
                <ProgressBar 
                  now={isPlaying ? 30 : 0}
                  variant={hasCover ? "light" : "primary"}
                />
                <div className="time-display">
                  <span>0:00</span>
                  <span>3:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="post-actions">
        <Button 
          variant="link" 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <FaHeart /> {post.like_count}
        </Button>
        <Button 
          variant="link" 
          className="action-btn"
          onClick={onComment}
        >
          <FaComment /> {post.comment_count}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default React.memo(SongPostCard);