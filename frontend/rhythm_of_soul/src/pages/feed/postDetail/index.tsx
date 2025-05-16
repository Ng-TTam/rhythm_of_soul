import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Comment, User } from '../../../model/post/post';

interface CommentSectionProps {
  comments: Comment[];
  currentUser: User;
  onSubmit: (content: string) => void;
  onLike: (commentId: string) => void;
  likedComments: { [key: string]: boolean };
  showAll: boolean;
  onToggleShowAll: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  onSubmit,
  onLike,
  likedComments,
  showAll,
  onToggleShowAll
}) => {

  return (
    <div className="comments-section">
      <CommentForm onSubmit={onSubmit} />
      <CommentList 
        comments={showAll ? comments : comments.slice(0, 3)}
        likedComments={likedComments}
        onLike={onLike}
      />
      {comments.length > 3 && (
        <Button 
          variant="link" 
          onClick={onToggleShowAll}
          className="show-more-btn"
        >
          {showAll ? 'Show fewer comments' : `Show all ${comments.length} comments`}
        </Button>
      )}
    </div>
  );
};

export default React.memo(CommentSection);