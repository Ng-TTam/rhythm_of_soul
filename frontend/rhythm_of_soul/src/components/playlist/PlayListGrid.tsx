import React, { useRef, useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import playlistPosts from './hooks/playlistPosts';
import ErrorBoundary from '../../pages/feed/ErrorBoundary';
import SkeletonPost from '../../pages/feed/SkeletonPost';
import { CurrentUser } from '../../model/post';
import PlayListPost from './PlayListPost';
import AddPlaylistModal from './CreatePlaylistDialog'; // Import the new modal

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
    createNewPlaylist,
    isCreating,
    creationError,
  } = playlistPosts(currentUser);
  
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePlaylist = async (playlistData: {
    title: string;
    isPublic: boolean;
    cover?: File;
    image?: File;
    tags: string[];
  }) => {
    try {
      await createNewPlaylist({
        ...playlistData,
        songIds: [] // Start with empty playlist, can add songs later
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      // Error will be shown in the modal via creationError
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Container className="my-4">
        {/* Add New Playlist Button */}
        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant="primary" 
            className="d-flex align-items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="me-2" />
            Tạo Playlist Mới
          </Button>
        </div>

        {/* Add Playlist Modal */}
        <AddPlaylistModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          currentUser={currentUser}
          onCreate={handleCreatePlaylist}
          isCreating={isCreating}
          error={creationError}
        />

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
          {posts.map((post) => (
            <Col xs={12} key={post.id} className="mb-4">
              <PlayListPost 
                post={post}
                playingTrackId={playingTrackId}
                likedTracks={likedPosts}
                onPlayTrack={handlePlayTrack}
                onLike={() => handleLike(post.id)}
                onComment={() => toggleComment(post.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default PlaylistGrid;