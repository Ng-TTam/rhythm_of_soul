import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRetweet } from '@react-icons/all-files/fa/FaRetweet';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaShare } from '@react-icons/all-files/fa/FaShare';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';

import { formatPlays } from '../../../model/post';

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
  <div className="post-footer">
    <div className="post-actions">
      <Button
        variant={isLiked ? 'danger' : 'outline-secondary'}
        onClick={onLike}
      >
        <FaHeart /> {likesCount}
      </Button>
      <Button
        variant={isReposted ? 'success' : 'outline-secondary'}
        onClick={onRepost}
      >
        <FaRetweet /> {repostsCount}
      </Button>
      <Button 
        variant="outline-secondary"
        onClick={onCommentClick}
      >
        <FaComment /> {commentsCount}
      </Button>
      <Button variant="outline-secondary">
        <FaShare />
      </Button>
    </div>
    <div className="post-stats">
      <span><FaPlay /> {formatPlays(viewCount)} plays</span>
    </div>
  </div>
);

export default React.memo(PostActions);