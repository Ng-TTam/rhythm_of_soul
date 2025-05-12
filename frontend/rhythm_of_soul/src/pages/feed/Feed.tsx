import React, { useRef, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import usePosts from './hooks/usePosts';
import TextPostCard from './TextPostCard';
import SongPostCard from './SongPostCard';
import CollectionPostCard from './CollectionPostCard';
import PostModal from './PostModal';
import ErrorBoundary from './ErrorBoundary';
import SkeletonPost from './SkeletonPost';
import { CurrentUser, PostWithUserInfo } from '../../model/post';

const currentUser: CurrentUser = {
  id: "1234",
  username: "Current User",
  avatar: "https://i1.sndcdn.com/avatars-6zJmWE24BNXpCEdL-qVvuHg-t120x120.jpg"
};

const Layout: React.FC = () => {
  const {
    posts,
    loading,
    error,
    commentOpen,
    likedPosts,
    playingTrackId,
    fetchPosts,
    handleLike,
    toggleComment,
    handlePlayTrack,
    addNewPost
  } = usePosts(currentUser);

  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostSubmit = (postData: any) => {
    const newPostId = `post_${Date.now()}`;
    let newPost: PostWithUserInfo = {
      id: newPostId,
      user_id: currentUser.id,
      type: postData.type.toUpperCase(),
      caption: postData.caption || '',
      content: null,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _public: postData._public,
      username: currentUser.username,
      userAvatar: currentUser.avatar
    };

    // Handle different post types
    switch (postData.type) {
      case 'TEXT':
        // Text posts have no additional content
        break;
        
      case 'SONG':
        newPost.content = {
          title: postData.content.title,
          mediaUrl: postData.content.mediaUrl ? postData.content.mediaUrl : '',
          imageUrl: postData.content.imageUrl ? postData.content.imageUrl : '',
          coverUrl: postData.content.coverUrl ? postData.content.coverUrl : '',
          tags: postData.tags || []
        };
        break;
        
    }

    addNewPost(newPost);
    setIsPostModalOpen(false);
  };

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
              onClick={() => setIsPostModalOpen(true)}
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
          {posts.length === 0 && !loading ? (
            <Col xs={12} className="text-center py-5">
              <p>No posts found.</p>
              <Button 
                variant="primary" 
                onClick={() => setIsPostModalOpen(true)}
                className="mt-2"
              >
                <FaPlus className="me-2" />
                Create Your First Post
              </Button>
            </Col>
          ) : (
            posts.map((post) => (
              <Col xs={12} key={post.id} className="mb-4">
                {post.type === 'TEXT' ? (
                  <TextPostCard 
                    post={post}
                    isLiked={!!likedPosts[post.id]}
                    onLike={() => handleLike(post.id)}
                    onComment={() => toggleComment(post.id)}
                  />
                ) : post.type === 'SONG' ? (
                  <SongPostCard 
                    post={post}
                    isPlaying={playingTrackId === post.id}
                    isLiked={!!likedPosts[post.id]}
                    onPlay={() => handlePlayTrack(post.id)}
                    onLike={() => handleLike(post.id)}
                    onComment={() => toggleComment(post.id)}
                  />
                ) : (
                  <CollectionPostCard 
                    post={post}
                    playingTrackId={playingTrackId}
                    likedTracks={likedPosts}
                    onPlayTrack={handlePlayTrack}
                    onLike={() => handleLike(post.id)}
                    onComment={() => toggleComment(post.id)}
                  />
                )}
              </Col>
            ))
          )}
        </Row>
        
        {/* Hidden audio element for playback */}
        <audio ref={audioRef} />
        
        {/* Post creation modal */}
        {isPostModalOpen && (
          <PostModal
            onClose={() => setIsPostModalOpen(false)}
            onPost={handlePostSubmit}
            currentUsername={currentUser.username}
            currentUserAvatar={currentUser.avatar}
            currentUserId={currentUser.id}
          />
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default Layout;