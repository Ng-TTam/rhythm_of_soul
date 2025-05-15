import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Tab, Tabs } from 'react-bootstrap';
import { currentUser } from '../../model/post';
import { fetchPostDetail } from '../../services/postService';
import PostHeader from './postDetail/PostHeader';
import TextPostContent from './postDetail/TextPostContent';
import CommentSection from './postDetail/index';
import PostActions from './postDetail/PostActions';
import { Post, Comment } from '../../model/post';
import '../../style/PostDetail.css';
import classNames from 'classnames/bind';
const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [openComment, setOpenComment] = useState(false);
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
  const cx = classNames.bind(require('../../style/PostDetail.css'));

  const fetchPostData = useCallback(async () => {
    try {
      if (!postId) {
        throw new Error('Post ID is missing');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetchPostDetail(postId);
      console.log('Post detail response:', response);
      if (response.code !== 200) {
        throw new Error('Invalid response from server');
      }
      const postData = {
        ...response.result.post,
        username: response.result.post.username || 'Unknown User',
        userAvatar: response.result.post.userAvatar || currentUser.avatar,
        like_count: response.result.post.like_count || 0,
        view_count: response.result.post.view_count || 0
      };

      const formattedComments = (response.result.comments || []).map(comment => ({
        ...comment,
        username: comment.username || 'Commenter',
        userAvatar: comment.userAvatar || currentUser.avatar,
        likes: comment.likes || 0,
        created_at: comment.created_at || new Date().toISOString()
      }));

      setState(prev => ({
        ...prev,
        post: postData,
        comments: formattedComments,
        likesCount: postData.like_count,
        loading: false,
        error: null
      }));
    } catch (err) {
      console.error('Error fetching post:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load post. Please try again later.',
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
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [postId]);

  const handleRepost = useCallback(async () => {
    try {
      // await repost(postId!);
      setState(prev => ({
        ...prev,
        isReposted: !prev.isReposted,
        repostsCount: prev.isReposted ? prev.repostsCount - 1 : prev.repostsCount + 1
      }));
    } catch (err) {
      console.error('Error reposting:', err);
    }
  }, [postId]);

  const handleCommentSubmit = useCallback(async (content: string) => {
    if (!postId || !state.post) return;

    try {
      // await addComment(postId, content);
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        account_id: currentUser.id,
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
        comment.id === commentId
          ? { ...comment, likes: (comment.likes || 0) + (wasLiked ? -1 : 1) }
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

  const handleCommentClick = () => {
    setOpenComment(prev => !prev);
    setTimeout(() => {
      document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderPostContent = () => {
    if (!state.post) return null;

    switch (state.post.type) {
      case 'TEXT':
        return <TextPostContent caption={state.post.caption} />;
      default:
        return null;
    }
  };

  if (state.loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <h2>{state.error}</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </Container>
    );
  }

  if (!state.post) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <h2>Post not found</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={cx('post-detail-container',classNames)}>
      <Card className="post-card">
        <PostHeader
          userAvatar={state.post.userAvatar || ''}
          username={state.post.username || 'Unknown User'}
          createdAt={state.post.created_at}
          type={state.post.type}
        />

        <Card.Body>
          {renderPostContent()}
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
      {openComment && (
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
      )
      }

    </Container>
  );
};

export default PostDetail;