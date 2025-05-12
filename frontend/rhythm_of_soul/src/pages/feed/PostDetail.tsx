import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Tab, Tabs } from 'react-bootstrap';
import { currentUser } from '../../model/post';
import { fetchPostDetail } from '../../services/postService';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import PostHeader from './postDetail/PostHeader';
import TextPostContent from './postDetail/TextPostContent';
import SongPostContent from './postDetail/SongPostContent';
import CollectionPostContent from './postDetail/CollectionPostContent';
import CommentSection from './postDetail/index';
import PostActions from './postDetail/PostActions';
import { Post, PostType, Comment } from '../../model/post';
import '../../style/PostDetail.css';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const {
    audioState,
    handlePlayPause,
    seekAudio
  } = useAudioPlayer();

  const [state, setState] = useState({
    post: null as Post | null,
    comments: [] as Comment[],
    loading: true,
    error: null as string | null,
    isLiked: false,
    isReposted: false,
    likesCount: 0,
    repostsCount: 0,
    showAllComments: false,
    likedComments: {} as { [key: string]: boolean }
  });
  
  // Track active tab state
  const [activeTab, setActiveTab] = useState<string>('details');

  // Handle switching to comments tab
  const handleCommentClick = () => {
    setActiveTab('comments');
    // Scroll to comment section after a short delay to ensure tab is shown
    setTimeout(() => {
      document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchPostData = useCallback(async () => {
    if (!postId) return;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetchPostDetail(postId);

      if (response.code === 0 && response.data) {
        const postData = {
          ...response.data.post,
          username: response.data.post.username || 'Unknown User',
          userAvatar: response.data.post.userAvatar || currentUser.avatar
        };

        const formattedComments = response.data.comments.map(comment => ({
          ...comment,
          username: comment.username || 'Commenter',
          userAvatar: comment.userAvatar || currentUser.avatar,
          likes: comment.likes || 0
        }));

        setState(prev => ({
          ...prev,
          post: postData,
          comments: formattedComments,
          likesCount: postData.like_count,
          loading: false
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load post. Please try again later.',
        loading: false
      }));
    }
  }, [postId]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleLike = useCallback(async () => {
    try {
      // await likePost(postId!);
      setState(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.likesCount + (prev.isLiked ? -1 : 1)
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [postId, state.isLiked]);

  const handleRepost = useCallback(async () => {
    try {
      // await repost(postId!);
      setState(prev => ({
        ...prev,
        isReposted: !prev.isReposted,
        repostsCount: prev.repostsCount + (prev.isReposted ? -1 : 1)
      }));
    } catch (err) {
      console.error('Error reposting:', err);
    }
  }, [postId, state.isReposted]);

  const handleCommentSubmit = useCallback(async (content: string) => {
    if (!postId || !state.post) return;

    try {
      // await addComment(postId, content);
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        user_id: currentUser.id,
        post_id: postId,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        likes: 0
      };
      
      setState(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments]
      }));
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  }, [postId, state.post]);

  const handleCommentLike = useCallback((commentId: string) => {
    setState(prev => {
      const wasLiked = prev.likedComments[commentId];
      const updatedComments = prev.comments.map(comment =>
        comment.id === commentId && comment.likes !== undefined
          ? { ...comment, likes: comment.likes + (wasLiked ? -1 : 1) }
          : comment
      );

      return {
        ...prev,
        likedComments: {
          ...prev.likedComments,
          [commentId]: !wasLiked
        },
        comments: updatedComments
      };
    });
  }, []);

  const toggleShowAllComments = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAllComments: !prev.showAllComments
    }));
  }, []);

  const renderPostContent = () => {
    if (!state.post) return null;

    switch (state.post.type) {
      case 'TEXT':
        return <TextPostContent caption={state.post.caption} />;
      case 'SONG':
        return (
          <SongPostContent
            content={state.post.content || {}}
            postId={state.post.id}
            playingTrackId={audioState.playingTrackId}
            audioPosition={audioState.position}
            audioProgress={audioState.progress}
            onPlayPause={handlePlayPause}
            onSeek={(e) => seekAudio(e, audioState.duration)}
            audioDuration={audioState.duration}
          />
        );
      case 'ALBUM':
      case 'PLAYLIST':
        return (
          <CollectionPostContent
            content={state.post.content || {}}
            type={state.post.type}
            playingTrackId={audioState.playingTrackId}
            onPlayPause={handlePlayPause}
          />
        );
      default:
        return null;
    }
  };

  if (state.loading) {
    return (
      <Container className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading post...</p>
      </Container>
    );
  }

  if (state.error || !state.post) {
    return (
      <Container className="error-container">
        <div className="error-card">
          <h2>{state.error || 'Post not found'}</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="post-detail-container">
      <Card className="post-card">
        <PostHeader
          userAvatar={state.post.userAvatar || currentUser.avatar}
          username={state.post.username || 'Unknown User'}
          createdAt={state.post.created_at}
          type={state.post.type}
        />

        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'details')}
            className="mb-3"
          >
            <Tab eventKey="details" title="Details">
              {renderPostContent()}
            </Tab>
            <Tab eventKey="comments" title={`Comments (${state.comments.length})`}>
              <div id="comment-section">
                <CommentSection
                  comments={state.comments}
                  currentUser={currentUser}
                  onSubmit={handleCommentSubmit}
                  onLike={handleCommentLike}
                  likedComments={state.likedComments}
                  showAll={state.showAllComments}
                  onToggleShowAll={toggleShowAllComments}
                />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>

        <PostActions
          isLiked={state.isLiked}
          isReposted={state.isReposted}
          likesCount={state.likesCount}
          repostsCount={state.repostsCount}
          commentsCount={state.comments.length}
          viewCount={state.post.view_count}
          onLike={handleLike}
          onRepost={handleRepost}
          onCommentClick={handleCommentClick}
        />
      </Card>
    </Container>
  );
};

export default PostDetail;