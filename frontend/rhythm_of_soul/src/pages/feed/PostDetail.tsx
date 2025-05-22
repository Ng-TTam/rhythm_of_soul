import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';
import { addComment, fetchPostDetail, likePost, unlikePost } from '../../services/postService';
import PostHeader from './postDetail/PostHeader';
import TextPostContent from './postDetail/TextPostContent';
import CommentSection from './postDetail/index';
import PostActions from './postDetail/PostActions';
import { Post, Comment,currentUser } from '../../model/post/post';
import PostSongDetail  from '../../components/songs/PostSongDetail';
import AlbumDetailView from '../../components/album/AlbumPage';
import PlaylistDetail from '../../components/playlist/PlayListDetail';
import { getUserByAccountId} from '../../services/api/userService';
import styles from '../../styles/PostDetail.module.css'; // Updated import


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

  const handleAddComment = (newComment: any) => {
    const comment : Comment = {
      id: newComment.id,
      content: newComment.content,
      account_id: currentUser.id,
      created_at: new Date().toISOString(),
      userAvatar: currentUser.avatar || '',
      username: currentUser.username,
      updated_at : new Date().toISOString(),
      likes: 0,
    }
    setState(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
  };
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
      const userResponse = await getUserByAccountId(response.result.post.account_id);
      if (userResponse.code !== 200) {
        throw new Error('Failed to fetch user data');
      }
      const user = userResponse.result;
      const postData = {
        ...response.result.post,
        username: `${user.first_name} ${user.last_name}` || 'Unknown User',
        userAvatar: user.avatar || currentUser.avatar,
        like_count: response.result.post.like_count || 0,
        view_count: response.result.post.view_count || 0
      };

      const formattedComments = (response.result.comments || []).map((comment: Comment) => ({
        ...comment,
        username: comment.username || 'Commenter',
        userAvatar: comment.userAvatar || currentUser.avatar,
        likes: comment.likes || 0,
        created_at: comment.created_at || new Date().toISOString()
      }));

      setState(prev => ({
        ...prev,
        post: postData,
        isLiked: postData._liked,
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
    if (!postId) return;
    
    try {
      setState(prev => {
        const newLikedState = !prev.isLiked;
        return {
          ...prev,
          isLiked: newLikedState,
          likesCount: newLikedState ? prev.likesCount + 1 : prev.likesCount - 1
        };
      });
  
      const currentIsLiked = !state.isLiked;
      currentIsLiked ? await likePost(postId) : await unlikePost(postId);
      
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLiked: prev.isLiked,
        likesCount: prev.likesCount
      }));
      console.error('Error liking post:', err);
    }
  }, [postId, state.isLiked]);

  const handleRepost = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        isReposted: !prev.isReposted,
        repostsCount: prev.isReposted ? prev.repostsCount - 1 : prev.repostsCount + 1
      }));
    } catch (err) {
      console.error('Error reposting:', err);
    }
  }, [postId]);



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
        return <TextPostContent caption={state.post.caption}  />;
      case 'SONG':
        return postId ? <PostSongDetail postId={postId} /> : null;
      case 'ALBUM':
        return postId ? <AlbumDetailView albumId={postId} /> : null;
      case 'PLAYLIST':
        return postId ? <PlaylistDetail playlistId={postId} /> : null;  
      default:
        return null;
    }
  };

  if (state.loading) {
    return (
      <Container className={styles['loading-container']}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className={styles['error-container']}>
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
      <Container className={styles['error-container']}>
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
    <Container className={styles['post-detail-container']}>
      <Card className={styles['post-card']}>
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
          commentsCount={state.post.comment_count}
          viewCount={state.post.view_count}
          onLike={handleLike}
          onRepost={handleRepost}
          onCommentClick={handleCommentClick}
        />
      </Card>

      {openComment && (
        <div id="comment-section">
          <CommentSection
            commentCount={state.comments.length}
            onAddComment={handleAddComment}
          />
        </div>
      )}
    </Container>
  );
};

export default PostDetail;