import React, { useRef, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import playlistPosts from './hooks/playlistPosts';
import ErrorBoundary from '../../pages/feed/ErrorBoundary';
import SkeletonPost from '../../pages/feed/SkeletonPost';
import { CurrentUser} from '../../model/post';
import PlayListPost from './PlayListPost';
const currentUser: CurrentUser = {
  id: "1234",
  username: "Current User",
  avatar: "https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg"
};
const PlaylistGrid: React.FC = () => {
  const {
    posts,
    loading,
    error,
    likedPosts,
    playingTrackId,
    fetchPosts,
    handleLike,
    toggleComment,
    handlePlayTrack,
  } = playlistPosts(currentUser);
  console.log('posts', posts);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Container className="my-4">
      {/* Create post card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex align-items-center">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.username} 
            className="me-3" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.jpg';
            }}
          />
          <Button 
            variant="light" 
            className="flex-grow-1 text-start text-muted border"
            
          >
            What's on your mind?
          </Button>
        </Card.Body>
      </Card>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          {[...Array(3)].map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error loading posts: {error}
          <Button 
            variant="link" 
            onClick={fetchPosts}
            className="ms-2"
          >
            Retry
          </Button>
        </div>
      )}
      
      {/* Feed content */}
      <Row>
        { 
          posts.map((post) => (
            <Col xs={12} key={post.id} className="mb-4">
              {
                <PlayListPost 
                  post={post}
                  playingTrackId={playingTrackId}
                  likedTracks={likedPosts}
                  onPlayTrack={handlePlayTrack}
                  onLike={() => handleLike(post.id)}
                  onComment={() => toggleComment(post.id)}
                />
              }
            </Col>
          ))
        }
      </Row>
    </Container>
  </ErrorBoundary>
);
     
};

export default PlaylistGrid;