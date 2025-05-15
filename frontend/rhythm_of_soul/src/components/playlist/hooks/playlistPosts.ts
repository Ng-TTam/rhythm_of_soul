// src/hooks/usePlaylistPosts.ts
import { useState, useEffect, useCallback } from 'react';
import { PostWithUserInfo, CurrentUser } from '../../../model/post';
import axios from 'axios';

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
      const response = await fetch(`http://localhost:8484/posts/${currentUser.id}/playlists`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.code === 200 && Array.isArray(result.result)) {
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
        const coverFormData = new FormData();
        coverFormData.append('file', playlistData.cover);
        coverFormData.append('type', 'cover');
        const coverResponse = await axios.post('http://localhost:8484/posts/uploadFile', coverFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Cover image response:', coverResponse);
        cover = coverResponse.data.result;
      }
  
      if (playlistData.image) {
        const imageFormData = new FormData();
        imageFormData.append('file', playlistData.image);
        imageFormData.append('type', 'image');
        const imageResponse = await axios.post('http://localhost:8484/posts/uploadFile', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        image = imageResponse.data.result;
      }
      // Prepare the request body
      const requestBody = {
        title:playlistData.title,
        isPublic:playlistData.isPublic,
        tags:playlistData.tags,
        cover,
        image,
        accountId: '1234', // Replace with actual user ID
      };
  
      console.log('Request body:', requestBody);
      

      const response = await axios.post('http://localhost:8484/posts/playlist', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);
      const result = await response.data.result;
      
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