import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { Comment, getRelativeTime } from '../../../model/post';

interface CommentListProps {
  comments: Comment[];
  likedComments: { [key: string]: boolean };
  onLike: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, likedComments, onLike }) => (
  <div className="comments-list">
    {comments.length > 0 ? (
      comments.map(comment => (
        <div key={comment.id} className="comment">
          <img 
            src={comment.userAvatar} 
            alt={comment.username} 
            className="comment-avatar"
          />
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-username">{comment.username}</span>
              <span className="comment-time">{getRelativeTime(comment.created_at)}</span>
            </div>
            <p className="comment-text">{comment.content}</p>
            <div className="comment-actions">
              <button
                className={`like-btn ${likedComments[comment.id] ? 'liked' : ''}`}
                onClick={() => onLike(comment.id)}
              >
                <FaHeart /> {comment.likes}
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="no-comments">
        No comments yet. Be the first to comment!
      </div>
    )}
  </div>
);

export default React.memo(CommentList);