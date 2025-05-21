import { useState, useEffect, useCallback, useRef } from 'react';
import { PostWithUserInfo, CurrentUser } from '../../../model/post/post';
import { likePost, unlikePost } from '../../../services/postService';
import { getAccessToken,DecodedToken } from '../../../utils/tokenManager';
import { getProfile } from '../../../services/api/userService';
import { jwtDecode } from 'jwt-decode';
const usePosts = () => {
  const currentUser = useRef<CurrentUser>({
    id: '',
    username: '',
    avatar: '/assets/images/default/avatar.jpg',
  });
  const [posts, setPosts] = useState<PostWithUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const accessToken = getAccessToken();
  const decodedToken = accessToken ? jwtDecode<DecodedToken>(accessToken) : null;
  const userId = decodedToken ? decodedToken.sub : null;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const responseUser = await getProfile();
      currentUser.current = {
        id: userId || '',
        username: responseUser.firstName + ' ' + responseUser.lastName,
        avatar: responseUser.avatar || '/assets/images/default/avatar.jpg',
      };
      console.log('Current user:', currentUser.current.id);
      const response = await fetch(`http://localhost:8484/content/posts/${currentUser.current.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Response:', currentUser.current.id);

      
      const result = await response.json();
      if (result.code === 200 && Array.isArray(result.result)) {
        const postsWithUserInfo = result.result.map((post: any) => ({
          ...post,
          username: currentUser.current.username,
          userAvatar: currentUser.current.avatar
        }));
        postsWithUserInfo.forEach((post: PostWithUserInfo) => {
          setLikedPosts(prev => ({
            ...prev,
            [post.id]: post._liked
          }));
        })
        setPosts(postsWithUserInfo);
        

      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback((postId: string) => {
    const alreadyLiked = likedPosts[postId];
    
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          alreadyLiked ? unlikePost(post.id) : likePost(post.id);
          return { 
            ...post, 
            like_count: post.like_count + (alreadyLiked ? -1 : 1), 
            _liked : !alreadyLiked
          };
        }
        return post;
      })
    );
    
    setLikedPosts(prev => ({ ...prev, [postId]: !alreadyLiked }));
  }, [likedPosts]);

  const toggleComment = useCallback((postId: string) => {
    setCommentOpen(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const handlePlayTrack = useCallback((trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
      
      setPosts(prev =>
        prev.map(post => {
          if (post.type === 'SONG' && post.content?.mediaUrl) {
            return { ...post, view_count: post.view_count + 1 };
          }
          
          if ((post.type === 'ALBUM' || post.type === 'PLAYLIST') && 
              post.content?.songIds?.some(song => song.songId === trackId)) {
            return { ...post, view_count: post.view_count + 1 };
          }
          
          return post;
        })
      );
    }
  }, [playingTrackId]);

  const addNewPost = useCallback((newPost: PostWithUserInfo) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  return {
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
  };
};

export default usePosts;