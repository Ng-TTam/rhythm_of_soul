import { useState, useEffect } from 'react';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { BsHeart } from '@react-icons/all-files/bs/BsHeart';
import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { BsChat } from '@react-icons/all-files/bs/BsChat';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';
import { MdLock } from '@react-icons/all-files/md/MdLock';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toggleePlay, setAudio } from '../../reducers/audioReducer';
import Swal from 'sweetalert2';
import EditSongModal from './SongEditForm';
import { Song, SongEditForm } from '../../model/post/Song';
import { getSongs, editSong, unlikePost, likePost } from '../../services/postService';
import { getAccessToken } from '../../utils/tokenManager';
import { jwtDecode } from 'jwt-decode';
import {  BsMusicNoteList } from '@react-icons/all-files/bs/BsMusicNoteList';

import AddToPlaylistModal from './AddToPlaylistModal';

export default function SongDisplay() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  const [showDropdown, setShowDropdown] = useState<number | string | null>(null);
  const [editingSong, setEditingSong] = useState<{
    id: string;
    data: {
      title: string;
      caption?: string;
      tags: string[];
      imageUrl?: string;
      coverUrl?: string;
      isPublic: boolean;
    };
  } | null>(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | number | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const audioState = useAppSelector(state => state.audio);
  
  let accountId = '';
  const accessToken = getAccessToken();
  if(accessToken) {
    accountId = jwtDecode(accessToken).sub || '';
  }

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await getSongs(accountId);
        if (response.code !== 200) throw new Error(response.message);

        const songsData = response.result || [];
        setSongs(songsData);
        handleSetLikedSongs(response.result as Song[]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [accountId]);

  const handleSetLikedSongs = (songs: Song[]) => {
    const likedSongsMap: Record<string, boolean> = {};
    songs.forEach((song) => {
      likedSongsMap[song.id] = song._liked;
    });
    setLikedSongs(likedSongsMap);
  }

  const handlePlaySong = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();

    if (audioState.mediaUrlSong === song.content.mediaUrl) {
      dispatch(toggleePlay(!audioState.play));
    } else {
      dispatch(setAudio({
        play: true,
        id : song.id,
        imageSong: song.content.imageUrl,
        titleSong: song.content.title,
        artistSong: song.account_id,
        mediaUrlSong: song.content.mediaUrl
      }));

    }
  };

  const handleSongDetail = (songId: string | number) => {
    navigate(`/post/${songId}`);
  };

  const toggleLike = async (e: React.MouseEvent, songId: string ) => {
    e.stopPropagation();
    const alreadyLiked = likedSongs[songId];

    try {
      if (alreadyLiked) {
        await unlikePost(songId);
      } else {
        await likePost(songId);
      }

      setSongs(prev =>
        prev.map(song => {
          if (song.id === songId) {
            return {
              ...song,
              like_count: song.like_count + (alreadyLiked ? -1 : 1),
              _liked: !alreadyLiked
            };
          }
          return song;
        })
      );

      setLikedSongs(prev => ({ ...prev, [songId]: !alreadyLiked }));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, songId: string | number) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === songId ? null : songId);
  };

  const navigateToEdit = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setEditingSong({
      id: song.id,
      data: {
        title: song.content.title,
        caption: song.caption,
        tags: song.content.tags,
        imageUrl: song.content.imageUrl,
        coverUrl: song.content.coverUrl,
        isPublic: song._public
      }
    });
    setShowDropdown(null);
  };

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

  const handleSaveEdit = async (updatedData: SongEditForm) => {
    try {
      console.log("Saving edit with data:", updatedData);
      const response = await editSong(editingSong?.id ?? '', updatedData);

      if (response.code !== 200) throw new Error(response.message);

      setSongs(songs.map(song =>
        song.id === editingSong?.id
          ? {
            ...song,
            content: { ...song.content, title: response.result.content.title, tags: response.result.content.tags, imageUrl: response.result.content.imageUrl, coverUrl: response.result.content.coverUrl },
            caption:response.result.caption
          }
          : song
      ));
      
      setEditingSong(null);
    } catch (err) {
      console.error("Error saving edit:", err);
      throw err;
    }
  };

  const handleDelete = async (e: React.MouseEvent, songId: string | number) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:8484/posts/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete song');

      setSongs(songs.filter(song => song.id !== songId));
      setShowDropdown(null);

      await Swal.fire(
        'Đã xóa!',
        'Bài hát của bạn đã được xóa.',
        'success'
      );
    } catch (err) {
      console.error("Delete error:", err);
      await Swal.fire(
        'Lỗi!',
        'Xóa bài hát thất bại.',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Music Collection</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="col"
            onClick={() => handleSongDetail(song.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSongDetail(song.id)}
          >
            <div className="card h-100 shadow-sm hover-shadow">
              <div className="position-relative">
                <img
                  src={song.content.imageUrl}
                  alt={song.content.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  loading="lazy"
                />

                <div
                  className="position-absolute top-0 end-0 m-2 p-1 bg-dark bg-opacity-50 rounded-circle hover-scale"
                  onClick={(e) => handlePlaySong(e, song)}
                  role="button"
                  aria-label={audioState.mediaUrlSong === song.content.mediaUrl && audioState.play ? "Pause song" : "Play song"}
                >
                  {audioState.mediaUrlSong === song.content.mediaUrl && audioState.play ?
                    <BsPauseFill size={24} color="white" /> :
                    <BsPlayFill size={24} color="white" />
                  }
                </div>

                <div className="position-absolute bottom-0 start-0 m-2 p-1">
                  {song._public ?
                    <MdPublic size={18} color="white" className="me-1" /> :
                    <MdLock size={18} color="white" className="me-1" />
                  }
                </div>
              </div>

              <div className="card-body">
                <h5 className="card-title text-truncate">{song.content.title}</h5>
                {song.caption && (
                  <p className="card-text text-muted line-clamp-2">
                    {song.caption}
                  </p>
                )}

                <div className="d-flex flex-wrap mt-2 gap-1">
                  {song.content.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-footer bg-white border-top-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm p-0"
                      onClick={(e) => toggleLike(e, song.id)}
                      aria-label={likedSongs[song.id] ? "Unlike song" : "Like song"}
                    >
                      <div className="d-flex align-items-center">
                        {likedSongs[song.id] ?
                          <BsHeartFill className="text-danger me-1" size={16} /> :
                          <BsHeart className="me-1" size={16} />
                        }
                        <span>{song.like_count}</span>
                      </div>
                    </button>

                    <div className="d-flex align-items-center">
                      <BsEyeFill size={16} className="me-1" />
                      <span>{song.view_count}</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <BsChat size={16} className="me-1" />
                      <span>{song.comment_count || 0}</span>
                    </div>
                  </div>

                  <div className="position-relative">
                    <button
                      className="btn btn-sm p-0"
                      onClick={(e) => toggleDropdown(e, song.id)}
                      aria-label="More options"
                    >
                      <BsThreeDots size={18} />
                    </button>

                    {showDropdown === song.id && (
                      <div className="dropdown-menu show" style={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 1000,
                        minWidth: '120px'
                      }}>
                        <button
                          className="dropdown-item"
                          onClick={(e) => navigateToEdit(e, song)}
                        >
                          Edit
                        </button>
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
                          className="dropdown-item text-danger"
                          onClick={(e) => handleDelete(e, song.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <small className="text-muted d-block mt-2">
                  {new Date(song.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && !loading && (
        <div className="text-center my-5">
          <p className="text-muted">No songs found.</p>
        </div>
      )}

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
            Swal.fire('Success', 'Successfully added to your playlist.', 'success');
          }}
        />
      )}

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dropdown-menu {
          background-color: white;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 0.25rem;
          padding: 0.5rem 0;
        }
        .dropdown-item {
          padding: 0.25rem 1.5rem;
          clear: both;
          font-weight: 400;
          color: #212529;
          text-align: inherit;
          text-decoration: none;
          white-space: nowrap;
          background-color: transparent;
          border: 0;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}