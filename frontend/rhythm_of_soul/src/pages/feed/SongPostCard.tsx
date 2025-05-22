import React, { useState } from 'react';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PostResponse, SongPostCardProps } from '../../model/post/post';
import styles from '../../styles/SongPostCard.module.css';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toggleePlay, setAudio } from '../../reducers/audioReducer';
import { BsMusicNoteList } from '@react-icons/all-files/bs/BsMusicNoteList';
import Swal from 'sweetalert2';
import AddToPlaylistModal from '../../components/songs/AddToPlaylistModal';
import EditSongModal from '../../components/songs/SongEditForm';
import { editSong } from '../../services/postService';
import { SongEditForm } from '../../model/post/Song';

const SongPostCard: React.FC<SongPostCardProps> = ({ 
  post, 
  isLiked, 
  onLike, 
  onComment 
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const audioState = useAppSelector(state => state.audio);
  const [showDropdown, setShowDropdown] = useState<number | string | null>(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | number | null>(null);
  const [editingSong, setEditingSong] = useState<{
    id: string;
    data: {
      title: string;
      caption?: string;
      tags: string[];
      imageUrl: string;
      coverUrl: string;
      isPublic: boolean;
    };
  } | null>(null);
  const [song, setSong] = useState<PostResponse>({
    id: post.id,
    account_id: post.account_id,
    type: post.type,
    caption: post.caption,
    content: post.content,
    view_count: post.view_count,
    like_count: post.like_count,
    comment_count: post.comment_count,
    created_at: post.created_at,
    updated_at: post.updated_at,
    _public: post._public,
    _liked: post._liked,
  });
  const handleAddToPlaylist = (e: React.MouseEvent, songId: string | number) => {
    e.stopPropagation();
    setSelectedSongId(songId);
    setShowAddToPlaylistModal(true);
    setShowDropdown(null);
  };

  const handleClosePlaylistModal = () => {
    setShowAddToPlaylistModal(false);
    setSelectedSongId(null);
  };
  const toggleDropdown = (e: React.MouseEvent, songId: string | number) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === songId ? null : songId);
  };
  const handleSaveEdit = async (updatedData: SongEditForm) => {
    try {
      console.log(updatedData)
      const response = await editSong(editingSong?.id ?? '', updatedData);

      if (response.code !== 200) throw new Error(response.message);
      console.log(response.result);
      // Update the song state with the new data
      setSong((prev) => ({
        ...prev,  
        content: {
          ...prev.content,
          title: response.result.content.title,
          imageUrl: response.result.content.imageUrl,
          coverUrl: response.result.content.coverUrl,
          tags: response.result.content.tags,
        },
        caption: response.result.caption,
      }));      
      setEditingSong(null);
    } catch (err) {
      console.error("Error saving edit:", err);
      throw err;
    }
  };
  const navigateToEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSong({
      id: post.id,
      data: {
        title: post.content?.title ?? '',
        caption: post.caption,
        tags: post.content?.tags ?? [],
        imageUrl : post.content?.imageUrl ?? '',
        coverUrl : post.content?.coverUrl ?? '', 
        isPublic: post._public,

      }
    });

    setShowDropdown(null);
  };
  if (!post.content) return null;
  
  const songImage = post.content.imageUrl || '/assets/images/default/music-thumbnail.jpg';
  const hasCover = post.content.coverUrl;

  // Determine if current song is playing
  const isPlaying = audioState.mediaUrlSong === post.content.mediaUrl && audioState.play;
  const handlePlaySong = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audioState.mediaUrlSong === post.content?.mediaUrl) {
      dispatch(toggleePlay(!audioState.play));
    } else {
      dispatch(setAudio({
        play: true,
        id: post.id,
        imageSong: post.content?.imageUrl ?? '/assets/images/default/music-thumbnail.jpg',
        titleSong: post.content?.title ?? '',
        artistSong: post.username || 'Unknown Artist',
        mediaUrlSong: post.content?.mediaUrl ?? '',
      }));
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment();
  };

  return (
    <Card 
      className={classNames(
        styles['song-post-card'],
        { [styles['with-cover']]: hasCover }
      )}
      
    >
      {/* Background cover */}
      {hasCover && (
        <div 
          className={styles['cover_background']}
          style={{ backgroundImage: `url(${song.content?.coverUrl})` }}
        />
      )}
      
      <Card.Header className={styles['post-header']} style={{background: "none"}}>
        <div className={styles['user-info']}>
          <img
            src={post.userAvatar || '/assets/images/default/avatar.jpg'}
            alt={post.username}
            className={styles['user-avatar']}
          />
          <div className={styles['user-details']}>
            <span className={styles['username']}>{post.username}</span>
            <span className={styles['post-date']}>
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button 
          variant="link" 
          className={styles['post-options']}
          onClick={(e) => toggleDropdown(e, post.id)}
        >
          <FaEllipsisH />
        </Button>
      </Card.Header>
      {showDropdown === post.id && (
                      <div className="dropdown-menu show" style={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 1000,
                        minWidth: '120px'
                      }}>
                        <button
                          className="dropdown-item"
                          onClick={(e) => handleAddToPlaylist(e, song.id)}
                        >
                          <div className="d-flex align-items-center">
                            <BsMusicNoteList className="me-1" size={14} />
                            Add to playlist
                          </div>
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={(e) => navigateToEdit(e)}
                        >
                          <div className="d-flex align-items-center">
                            Edit
                          </div>
                        </button> 
                      </div>
                    )}
      <Card.Body className={styles['post-content']} onClick={handleCardClick}>
        <div className={styles['song-media']}>
          <img
            src={song.content?.imageUrl || songImage}
            alt={song.content?.title}
            className={styles['song-thumbnail']}
          />
          
          <div className={styles['song-info']}>
            <h3 className={styles['song-title']}>{song.content?.title}</h3>
            
            {post.caption && (
              <p className={styles['song-caption']}>{song.caption}</p>
            )}
            
            <div className={styles['player-controls']}>
              <Button 
                variant={isPlaying ? "danger" : "primary"} 
                className={styles['play-btn']}
                onClick={handlePlaySong}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              
              <div className={styles['progress-container']}>
                <ProgressBar 
                  now={isPlaying ? 30 : 0}
                  variant={hasCover ? "light" : "primary"}
                />
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className={styles['post-actions']}>
        <Button 
          variant="link" 
          className={classNames(
            styles['action-btn'],
            { [styles['liked']]: isLiked }
          )}
          onClick={handleLike}
        >
          <FaHeart /> {post.like_count}
        </Button>
        <Button 
          variant="link" 
          className={styles['action-btn']}
          onClick={handleComment}
        >
          <FaComment /> {post.comment_count}
        </Button>
      </Card.Footer>
      {editingSong && (
        <EditSongModal
          songId={editingSong.id}
          initialData={editingSong.data}
          onClose={() => setEditingSong(null)}
          onSave={handleSaveEdit}
        />
      )}
      {showAddToPlaylistModal && selectedSongId && (
        <AddToPlaylistModal 
          songId={String(selectedSongId)}
          onClose={handleClosePlaylistModal}
          onAddSuccess={() => {
            Swal.fire('Success', 'Successfully added to your playlist', 'success');
          }}
        />
      )}
    </Card>

    );
  };

export default React.memo(SongPostCard);