import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';

import { useNavigate } from 'react-router-dom';
import { CollectionPostCardProps } from '../../model/post/post';
import styles from '../../styles/CollectionPostCard.module.css'; // Thay đổi cách import
import classNames from 'classnames';

const CollectionPostCard: React.FC<CollectionPostCardProps> = ({ 
  post, 
  playingTrackId, 
  onPlayTrack, 
  onLike, 
  onComment 
}) => {
  const navigate = useNavigate();

  if (!post.content || !post.content.songIds) return null;
  
  const imageUrl = post.content.imageUrl || '/assets/images/default/avatar.jpg';
  
  const handlePostDetail = (postId: string, postType: string) => {
    navigate(`/post/${postId}`);  
  }

  return (
    <Card className={styles['collection-post-card']}>
      <Card.Header className={styles['collection-header']}>
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
            <span className={styles['post-date']}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        <span className={classNames(
          styles['collection-type'],
          styles[post.type.toLowerCase()]
        )}>
          {post.type}
        </span>
      </Card.Header>
      
      {post.caption && (
        <Card.Text className={styles['collection-caption']}>
          {post.caption}
        </Card.Text>
      )}
      
      <Card.Body className={styles['collection-body']}>
        <Row className={styles['collection-info']}>
          <Col xs={12} md={4} className={styles['collection-cover-container']}>
            <div className={styles['collection-cover-wrapper']}>
              <img
                src={imageUrl}
                alt={post.content.title}
                className={styles['collection-cover']}
                onClick={() => handlePostDetail(post.id, post.type)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
                }}
              />
              <div 
                className={styles['play-overlay']} 
                onClick={() => handlePostDetail(post.id, post.type)}
              >
                <FaPlayCircle size={24} color="white" />
              </div>
            </div>
          </Col>
          <Col xs={12} md={8} className={styles['collection-details']}>
            <h2 className={styles['collection-title']}>{post.content.title}</h2>
            <p className={styles['collection-meta']}>
              <span>by {post.username}</span>
              <span>•</span>
              <span>{post.content.songIds.length} tracks</span>
            </p>
            
            <div className={styles['collection-tags']}>
              {post.content.tags?.map((tag, index) => (
                <span key={index} className={styles['collection-tag']}>
                  #{tag}
                </span>
              ))}
            </div>
          </Col>
        </Row>

        <div className={styles['track-list']}>
          {post.content.songIds.map((song, index) => (
            <div key={index} className={styles['track-item']}>
              <div className={styles['track-number']}>{index + 1}</div>
              <img
                src={song.imageUrl || '/assets/images/default/track-thumbnail.jpg'}
                alt={song.title}
                className={styles['track-thumbnail']}
                onClick={() => song.songId && navigate(`/post/${song.songId}`)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/track-thumbnail.jpg';
                }}
              />
              <div className={styles['track-info']}>
                <div className={styles['track-title']}>{song.title}</div>
                <div className={styles['track-tags']}>
                  {song.tags?.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles['track-tag']}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button 
                variant="link" 
                className={styles['track-play-btn']} 
                onClick={() => onPlayTrack(song.songId || `song-${index}`)}
              >
                {playingTrackId === (song.songId || `song-${index}`) ? (
                  <FaPause size={18} />
                ) : (
                  <FaPlay size={18} />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className={styles['collection-actions']}>
          <Button 
            variant="link" 
            className={classNames(
              styles['action-btn'],
              styles['like-btn'],
              { [styles['liked']]: post._liked }
            )}
            onClick={onLike}
          >
            <FaHeart className={styles['action-icon']} /> 
            <span className={styles['action-count']}>{post.like_count}</span>
          </Button>
          <Button 
            variant="link" 
            className={classNames(styles['action-btn'], styles['comment-btn'])}
            onClick={onComment}
          >
            <FaComment className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.comment_count}</span>
          </Button>
          <div className={classNames(styles['action-btn'], styles['view-count'])}>
            <FaPlayCircle className={styles['action-icon']} />
            <span className={styles['action-count']}>{post.view_count}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default React.memo(CollectionPostCard);