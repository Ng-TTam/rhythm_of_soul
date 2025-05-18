import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';

import { TextPostCardProps } from '../../model/post/post';
import { useNavigate } from 'react-router-dom';
import '../../style/TextPostCard.css'; // We'll create this CSS file
import classNames from 'classnames/bind';

const TextPostCard: React.FC<TextPostCardProps> = ({ 
  post, 
  isLiked, 
  onLike, 
  onComment 
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  const cx = classNames.bind(require('../../style/TextPostCard.css'));
  return (
    <Card className={cx("text-post-card",classNames)}>
      <Card.Header className="post-header">
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
            <span className="username">{post.username}</span>
            <span className="post-date">{formatDate(post.created_at)}</span>
          </div>
        </div>
        <Button variant="link" className="post-options">
          <FaEllipsisH />
        </Button>
      </Card.Header>
      
      <Card.Body 
        className="post-content" 
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <div className="post-text">{post.caption}</div>
      </Card.Body>
      
      <Card.Footer className="post-footer">
        <div className="post-actions">
          <Button 
            variant="link" 
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <FaHeart className="action-icon" />
            <span className="action-count">{post.like_count}</span>
          </Button>
          
          <Button 
            variant="link" 
            className="action-btn comment-btn"
            onClick={(e) => {
              e.stopPropagation();
              onComment();
            }}
            aria-label="Comment on post"
          >
            <FaComment className="action-icon" />
            <span className="action-count">{post.comment_count}</span>
          </Button>
          
          <div className="action-btn view-count">
            <FaPlayCircle className="action-icon" />
            <span className="action-count">{post.view_count}</span>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default React.memo(TextPostCard);