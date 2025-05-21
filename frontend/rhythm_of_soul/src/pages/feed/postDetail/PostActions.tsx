import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRetweet } from '@react-icons/all-files/fa/FaRetweet';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaShare } from '@react-icons/all-files/fa/FaShare';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { formatPlays } from '../../../model/post/post';
import styles from '../../../styles/PostDetail.module.css'; // Updated import

interface PostActionsProps {
  isLiked: boolean;
  isReposted: boolean;
  likesCount: number;
  repostsCount: number;
  commentsCount: number;
  viewCount: number;
  onLike: () => void;
  onRepost: () => void;
  onCommentClick: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  isLiked,
  isReposted,
  likesCount,
  repostsCount,
  commentsCount,
  viewCount,
  onLike,
  onRepost,
  onCommentClick
}) => (
  <div className={styles['post-footer']}>
    <div className={styles['post-actions']}>
      <Button
        variant={isLiked ? 'danger' : 'outline-secondary'}
        onClick={onLike}
        className={styles['action-button']}
      >
        <FaHeart className={styles['action-icon']} /> 
        <span className={styles['action-count']}>{likesCount}</span>
      </Button>
      <Button
        variant={isReposted ? 'success' : 'outline-secondary'}
        onClick={onRepost}
        className={styles['action-button']}
      >
        <FaRetweet className={styles['action-icon']} /> 
        <span className={styles['action-count']}>{repostsCount}</span>
      </Button>
      <Button 
        variant="outline-secondary"
        onClick={onCommentClick}
        className={styles['action-button']}
      >
        <FaComment className={styles['action-icon']} /> 
        <span className={styles['action-count']}>{commentsCount}</span>
      </Button>
      <Button 
        variant="outline-secondary" 
        className={styles['action-button']}
      >
        <FaShare className={styles['action-icon']} />
      </Button>
    </div>
    <div className={styles['post-stats']}>
      <span>
        <FaPlay className={styles['play-icon']} /> 
        {formatPlays(viewCount)} plays
      </span>
    </div>
  </div>
);

export default React.memo(PostActions);