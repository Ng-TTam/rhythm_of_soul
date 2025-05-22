import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';

import { TextPostCardProps } from '../../model/post/post';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TextPostCard.module.css'; // Updated import
import classNames from 'classnames';
import { editTextPost } from '../../services/postService';
import EditPostText from './EditPostText';

const TextPostCard: React.FC<TextPostCardProps> = ({ 
  post, 
  isLiked, 
  onLike, 
  onComment 
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState<number | string | null>(null);
  const [editingSong, setEditingSong] = useState<{
    id: string;
    data: {
      caption?: string;
      isPublic: boolean;
    };
  } | null>(null);
  const [text, setText] = useState(post);
  const toggleDropdown = (e: React.MouseEvent, songId: string | number) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === songId ? null : songId);
  };
  const navigateToEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSong({
      id: post.id,
      data: {
        caption: post.caption,
        isPublic: post._public,

      }
    });

    setShowDropdown(null);
  };
  const handleSaveEdit = async (updatedData:{
    caption?: string;
    isPublic: boolean;
  }) => {
    try {
      console.log(updatedData)
      const response = await editTextPost(editingSong?.id ?? '', updatedData);

      if (response.code !== 200) throw new Error(response.message);
      console.log(response.result);
      // Update the song state with the new data
      setText((prev) => ({
        ...prev,  
        caption: response.result.caption,
        _public: response.result._public,
      }));      
      setEditingSong(null);
    } catch (err) {
      console.error("Error saving edit:", err);
      throw err;
    }
  };
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
        <Button 
          variant="link" 
          className={styles['post-options']}
          onClick={(e) => toggleDropdown(e, post.id)}
        >
          <FaEllipsisH />
        </Button>
      </Card.Header>
      {showDropdown === post.id && (
                      <div className="dropdown-menu show" style={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 1000,
                        minWidth: '120px'
                      }}>
                       
                        <button
                          className="dropdown-item"
                          onClick={(e) => navigateToEdit(e)}
                        >
                          <div className="d-flex align-items-center">
                            Edit
                          </div>
                        </button> 
                      </div>
                    )}
      <Card.Body 
        className={styles['post-content']} 
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <div className={styles['post-text']}>{text.caption}</div>
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
            <span className={styles['action-count']}>{text.like_count}</span>
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
            <span className={styles['action-count']}>{text.comment_count}</span>
          </Button>
          
          <div className={classNames(styles['action-btn'], styles['view-count'])}>
            <FaPlayCircle className={styles['action-icon']} />
            <span className={styles['action-count']}>{text.view_count}</span>
          </div>
        </div>
      </Card.Footer>
      {editingSong && (
        <EditPostText
          postId={editingSong.id}
          initialData={editingSong.data}
          currentUsername ={post.username}
          currentUserAvatar ={post.userAvatar}
          onClose={() => setEditingSong(null)}
          onSave={handleSaveEdit}
        />
      )}
    </Card>
  );
};

export default React.memo(TextPostCard);