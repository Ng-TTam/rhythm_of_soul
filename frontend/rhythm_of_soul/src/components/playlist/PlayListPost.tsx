import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEye } from '@react-icons/all-files/fa/FaEye';


import { PlaylistPostCardProps} from '../../model/post/post';
import styles from '../../styles/PlaylistPost.module.css'; // Updated import
import classNames from 'classnames';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';
import { updatePlaylist } from '../../services/postService';
import EditPlaylistModal from './EditPlaylist';

const PlaylistPostCard: React.FC<PlaylistPostCardProps> = ({
  post,
  playingTrackId,
  isLiked,
  onPlayTrack,
  onLike,
  onComment
}) => {
  const navigate = useNavigate();
  const [localLikedTracks, setLocalLikedTracks] = useState<Record<string, boolean>>({});
  const [playlist, setPlaylist] = useState(post);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  
  if (!post.content) return null;
  
  const handleEditPlaylist = async (updatedPlaylistData: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverUrl: string;
    imageUrl: string;
    tracks: string[];
    caption : string;
  }) => {
    if (!editingPlaylistId) return;
    console.log("Update:", updatedPlaylistData);
    try {

      const requestBody = {
        title: updatedPlaylistData.title,
        isPublic: updatedPlaylistData.isPublic,
        tags: updatedPlaylistData.tags,
        coverUrl: updatedPlaylistData.coverUrl,
        imageUrl: updatedPlaylistData.imageUrl,
        songIds: updatedPlaylistData.tracks,
        caption: updatedPlaylistData.caption,
      };

      const response = await updatePlaylist(editingPlaylistId, requestBody);
      console.log("Response:", response);
      if (response.code === 200) {
        setPlaylist({
          ...playlist,
          content: {
            ...playlist.content,
            title: response.result.content.title,
            tags: response.result.content.tags,
            coverUrl: response.result.content.coverUrl,
            imageUrl: response.result.content.imageUrl,
            songIds: response.result.content.tracks
          }
        } as any); // Update the playlist state with the new data
        setEditingPlaylistId(null);
        return Promise.resolve();
      }
      throw new Error(response.message || 'Failed to update Playlist');
    } catch (err) {
      console.error("Error updating Playlist:", err);
      return Promise.reject(err);
    }
  };

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const songs = post.content.songIds || [];
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike();
    } else {
      setLocalLikedTracks(prev => ({
        ...prev,
        [post.id]: !prev[post.id]
      }));
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };
  
  const handleViewDetail = () => {
    navigate(`/post/${post.id}`);
  };
  
  const handleViewEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlaylistId(post.id);
  }
  
  return (
    <div className={styles['playlist-card']} >
      {/* Header with Banner Background */}
      <div 
        className={styles['card-header-banner']}
        style={{ backgroundImage: `url(${playlist.content?.coverUrl})` , height : "280px"}}
      >
        <div className={styles['banner-overlay']}>
        <button className={styles['playlist-type']} style={{justifyItems : "end",width :"99%", background :"none"}} onClick={(e) => handleViewEdit(e)} >
              <FaEllipsisH style={{color :"black"}} />
            </button>
        </div>
       
        <div className={styles['header-content']} onClick={handleViewDetail}>
          
          <div className={styles['user-info']}>
            <img
              src={post.userAvatar || '/assets/images/default/avatar.jpg'}
              alt={post.username}
              className={styles['user-avatar']}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
              }}
            />
            <div className={styles['user-details']}>
              <div className={styles['username']}>{post.username}</div>
              <div className={styles['post-date']}>{formattedDate}</div>
            </div>
          </div>
          
          <span className={styles['playlist-type']}>
            {playlist.type}
          </span>
        </div>
        
        <div className={styles['banner-content']}>
          <div className={styles['banner-title-area']}>
            <h2 className={styles['banner-title']}>{playlist.content?.title}</h2>
            <h5 className={styles['banner-meta']}>{playlist.caption}</h5>
            <div className={styles['banner-meta']}>
              • {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles['card-body']}>
        <div className={styles['flex-container']}>
          {/* Playlist Cover */}
          <div className={styles['album-cover-container']}>
            <div className={styles['album-cover-wrapper']}>
              <img
                src={playlist.content?.imageUrl || '/assets/images/default/playlist-thumbnail.jpg'}
                alt={playlist.content?.title}
                className={styles['album-cover']}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/playlist-thumbnail.jpg';
                }}
              />
            </div>
          </div>
          
          {/* Playlist Details */}
          <div className={styles['playlist-details']}>
            {/* Tags */}
            {playlist.content?.tags && playlist.content.tags.length > 0 && (
              <div className={styles['tags-container']}>
                {playlist.content.tags.map((tag, index) => (
                  <span key={index} className={styles['tag']}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={styles['actions-container']}>
          <button 
            className={classNames(
              styles['action-button'],
              { [styles['liked']]: isLiked }
            )}
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart className={styles['action-icon']} />
            ) : (
              <FaRegHeart className={styles['action-icon']} />
            )}
            <span className={styles['action-count']}>{playlist.like_count}</span>
          </button>
          <button 
            className={styles['action-button']}
            onClick={handleComment}
          >
            <FaComment className={styles['action-icon']} />
            <span className={styles['action-count']}>{playlist.comment_count}</span>
          </button>
          <div className={styles['view-display']}>
            <FaEye className={styles['action-icon']} />
            <span className={styles['action-count']}>{playlist.view_count}</span>
          </div>
        </div>
      </div>
      {editingPlaylistId && (
        <EditPlaylistModal
          show={!!editingPlaylistId}
          onHi={() => setEditingPlaylistId(null)}
          onEditPlaylist={handleEditPlaylist}
          postId={post.id}
        />
      )}
    </div>
  );
};

export default React.memo(PlaylistPostCard);