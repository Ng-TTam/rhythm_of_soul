// src/hooks/usePlaylistPosts.ts
import { useState, useEffect, useCallback } from 'react';
import { PostWithUserInfo, CurrentUser } from '../../../model/post/post';
import axios from 'axios';
import { fetchPlaylists,uploadFile,createPlaylist,unlikePost,likePost } from '../../../services/postService';
const usePlaylistPosts = (currentUser: CurrentUser) => {
  const [posts, setPosts] = useState<PostWithUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPlaylists(currentUser.id);
      
      if (response.code !== 200) {
        throw new Error(`HTTP error! Status: ${response.message}`);
      }
      
      if (response.code === 200 && Array.isArray(response.result)) {
        const postsWithUserInfo = response.result.map((post: any) => ({
          ...post,
          username: currentUser.username,
          userAvatar: currentUser.avatar
        }));
        
        setPosts(postsWithUserInfo);
        postsWithUserInfo.forEach((post: PostWithUserInfo) => {
          setLikedPosts(prev => ({
            ...prev,
            [post.id]: post._liked
          }));
        });
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

  const createNewPlaylist = useCallback(async (playlistData: {
    title: string;
    isPublic?: boolean;
    cover?: File;
    image?: File;
    tags?: string[];
    songIds?: Array<{ songId: string; title: string; imageUrl?: string }>;
  }) => {
    try {
      setIsCreating(true);
      setCreationError(null);
      
      let cover = '';
      let image = '';
  
      if (playlistData.cover) {
       const coverResponse = await uploadFile(
          {
            file: playlistData.cover,
            type: 'cover'
          }
       );
        cover = coverResponse.result;
      }
  
      if (playlistData.image) {
        const imageResponse = await uploadFile(
          {
            file: playlistData.image,
            type: 'image'
          }
        );
        image = imageResponse.result;
      }
      // Prepare the request body
      const requestBody = {
        title: playlistData.title,
        isPublic: playlistData.isPublic ?? false, // Ensure isPublic is a boolean
        tags: playlistData.tags || [], // Ensure tags is an array
        cover,
        image,
        accountId: '1234', // Replace with actual user ID
      };
  
      const response = await createPlaylist(requestBody);
      const result = await response.result;
      
      if (result.code === 200) {
        const newPost: PostWithUserInfo = {
          ...result.result,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          like_count: 0,
          comment_count: 0,
          view_count: 0,
          type: 'playlist',
          content: {
            ...result.result.content,
            tags: playlistData.tags || []
          }
        };
        
        setPosts(prev => [newPost, ...prev]);
        return newPost;
      } else {
        throw new Error(result.message || 'Failed to create playlist');
      }
    } catch (err) {
      setCreationError(err instanceof Error ? err.message : 'Failed to create playlist');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [currentUser]);

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
            return { ...post, view_count: post.view_count + 1 };
        })
      );
    }
  }, [playingTrackId]);

  return {
    posts,
    loading,
    error,
    commentOpen,
    likedPosts,
    playingTrackId,
    isCreating,
    creationError,
    fetchPosts,
    handleLike,
    toggleComment,
    handlePlayTrack,
    createNewPlaylist,
  };
};

export default usePlaylistPosts;