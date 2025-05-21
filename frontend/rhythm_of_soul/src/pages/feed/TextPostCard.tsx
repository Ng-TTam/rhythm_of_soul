import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';

import { TextPostCardProps } from '../../model/post/post';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TextPostCard.module.css'; // Updated import
import classNames from 'classnames';

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
  return (
    <Card className={styles['text-post-card']}>
      <Card.Header className={styles['post-header']}>
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
            <span className={styles['username']}>{post.username}</span>
            <span className={styles['post-date']}>{formatDate(post.created_at)}</span>
          </div>
        </div>
        <Button variant="link" className={styles['post-options']}>
          <FaEllipsisH />
        </Button>
      </Card.Header>
      
      <Card.Body 
        className={styles['post-content']} 
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <div className={styles['post-text']}>{post.caption}</div>
      </Card.Body>
      
      <Card.Footer className={styles['post-footer']}>
        <div className={styles['post-actions']}>
          <Button 
            variant="link" 
            className={classNames(
              styles['action-btn'],
              styles['like-btn'],
              { [styles['liked']]: isLiked }
            )}
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <FaHeart className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.like_count}</span>
          </Button>
          
          <Button 
            variant="link" 
            className={classNames(styles['action-btn'], styles['comment-btn'])}
            onClick={(e) => {
              e.stopPropagation();
              onComment();
            }}
            aria-label="Comment on post"
          >
            <FaComment className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.comment_count}</span>
          </Button>
          
          <div className={classNames(styles['action-btn'], styles['view-count'])}>
            <FaPlayCircle className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.view_count}</span>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default React.memo(TextPostCard);