import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';

import { useNavigate } from 'react-router-dom';
import { CollectionPostCardProps } from '../../model/post';
import '../../style/CollectionPostCard.css'; // We'll create this CSS file
import classNames from 'classnames/bind';
const CollectionPostCard: React.FC<CollectionPostCardProps> = ({ 
  post, 
  playingTrackId, 
  likedTracks, 
  onPlayTrack, 
  onLike, 
  onComment 
}) => {
  console.log('CollectionPostCard', post);
  const navigate = useNavigate();
  const cx = classNames.bind(require('../../style/CollectionPostCard.css'));
  if (!post.content || !post.content.songIds) return null;
  
  const imageUrl = post.content.imageUrl || '/assets/images/default/avatar.jpg';
  const handlePostDetail = (postId: string, postType: string) => {
    if (postType === 'ALBUM') {
      navigate(`/albums/${postId}`);
    } else {
      navigate(`/playlist/${postId}`);
    }
  }
  return (
    <Card className={cx('collection-post-card',classNames)}>
      <Card.Header className="collection-header">
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
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        <span className={`collection-type ${post.type.toLowerCase()}`}>
          {post.type}
        </span>
      </Card.Header>
      
      {post.caption && (
        <Card.Text className="collection-caption">
          {post.caption}
        </Card.Text>
      )}
      
      <Card.Body className="collection-body">
        <Row className="collection-info">
          <Col xs={12} md={4} className="collection-cover-container">
            <div className="collection-cover-wrapper">
              <img
                src={imageUrl }
                alt={post.content.title}
                style={{ width: '100%', height: '100%' }}
                className="collection-cover"
                onClick={() => handlePostDetail(post.id, post.type)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
                }}
              />
              <div className="play-overlay" onClick={() => handlePostDetail(post.id, post.type)}>
              </div>
            </div>
          </Col>
          <Col xs={12} md={8} className="collection-details">
            <h2 className="collection-title">{post.content.title}</h2>
            <p className="collection-meta">
              <span>by {post.username}</span>
              <span>•</span>
              <span>{post.content.songIds.length} tracks</span>
            </p>
            
            <div className="collection-tags">
              {post.content.tags?.map((tag, index) => (
                <span key={index} className="collection-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </Col>
        </Row>

        <div className="track-list">
          {post.content.songIds.map((song, index) => (
            <div key={index} className="track-item">
              <div className="track-number">{index + 1}</div>
              <img
                src={song.imageUrl || '/assets/images/default/track-thumbnail.jpg'}
                alt={song.title}
                className="track-thumbnail"
                onClick={() => song.songId && navigate(`/post/${song.songId}`)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/track-thumbnail.jpg';
                }}
              />
              <div className="track-info">
                <div className="track-title">{song.title}</div>
                <div className="track-tags">
                  {song.tags?.map((tag, tagIndex) => (
                    <span key={tagIndex} className="track-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button 
                variant="link" 
                className="track-play-btn" 
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

        <div className="collection-actions">
          <Button 
            variant="link" 
            className={`action-btn like-btn ${likedTracks[post.id] ? 'liked' : ''}`}
            onClick={onLike}
          >
            <FaHeart className="action-icon" />
            <span className="action-count">{post.like_count}</span>
          </Button>
          <Button 
            variant="link" 
            className="action-btn comment-btn"
            onClick={onComment}
          >
            <FaComment className="action-icon" />
            <span className="action-count">{post.comment_count}</span>
          </Button>
          <div className="action-btn view-count">
            <FaPlayCircle className="action-icon" />
            <span className="action-count">{post.view_count}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default React.memo(CollectionPostCard);