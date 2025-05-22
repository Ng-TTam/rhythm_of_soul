import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { getAccessToken } from '../../utils/tokenManager';

interface TextEditForm {
  caption: string;
  isPublic: boolean;
}

interface EditTextModalProps {
  postId: string | number;
  initialData: {
    caption?: string;
    isPublic?: boolean;
  };
  onClose: () => void;
  onSave: (updatedData: TextEditForm) => Promise<void>;
  currentUsername: string;
  currentUserAvatar: string;
}

export default function EditPostText({
  postId, 
  initialData, 
  onClose, 
  onSave,
  currentUsername,
  currentUserAvatar,
}: EditTextModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [caption, setCaption] = useState(initialData.caption || '');
  const [publicPost, setPublicPost] = useState(initialData.isPublic ?? true);
  const visibilityOptions = ['Public', 'Private'];

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setCaption(initialData.caption || '');
      setPublicPost(initialData.isPublic ?? true);
    }
  }, [initialData]);

  const handleVisibilityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPublicPost(value === 'Public');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const textPostData = {
        caption: caption,
        isPublic: publicPost,
      };
      await onSave(textPostData);
      
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error('Error updating post:', error);
      const err = error as any;
      setErrorMessage(err.response?.data?.message || 'Error updating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [caption, publicPost, onSave, onClose]);

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          
          <div className="d-flex mb-3">
            <img
              src={currentUserAvatar}
              alt={currentUsername}
              style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 15 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.jpg';
              }}
            />
            <div>
              <h6>{currentUsername}</h6>
              <select
                className="form-select form-select-sm"
                style={{ width: 150 }}
                onChange={handleVisibilityChange}
                value={publicPost ? 'Public' : 'Private'}
              >
                {visibilityOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="caption"
              rows={3}
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}