import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaPaperPlane } from '@react-icons/all-files/fa/FaPaperPlane';
import { currentUser } from '../../../model/post/post'; // Adjust the import path as necessary

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [commentContent, setCommentContent] = React.useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onSubmit(commentContent);
      setCommentContent('');
      inputRef.current?.focus();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.username} 
          className="comment-avatar"
        />
        <Form.Control
          as="textarea"
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          ref={inputRef}
          rows={2}
        />
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!commentContent.trim()}
        >
          <FaPaperPlane />
        </Button>
      </div>
    </Form>
  );
};

export default React.memo(CommentForm);