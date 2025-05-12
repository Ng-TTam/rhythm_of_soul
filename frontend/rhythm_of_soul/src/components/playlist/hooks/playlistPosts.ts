import { useState, useEffect, useCallback } from 'react';
import { PostWithUserInfo, CurrentUser } from '../../../model/post';

const usePlaylistPosts = (currentUser: CurrentUser) => {
  const [posts, setPosts] = useState<PostWithUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8484/posts/${currentUser.id}/playlists`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Fetched posts:', result);
      
      if (result.code === 0 && Array.isArray(result.result)) {
        const postsWithUserInfo = result.result.map((post: any) => ({
          ...post,
          username: currentUser.username,
          userAvatar: currentUser.avatar
        }));
        
        setPosts(postsWithUserInfo);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback((postId: string) => {
    const alreadyLiked = likedPosts[postId];
    
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            like_count: post.like_count + (alreadyLiked ? -1 : 1) 
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
            return { ...post, view_count: post.view_count + 1 };
          
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

export default usePlaylistPosts;