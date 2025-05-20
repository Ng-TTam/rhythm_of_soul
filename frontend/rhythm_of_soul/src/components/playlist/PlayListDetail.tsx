import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import '../../style/PlaylistDetail.css';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { playSingleSong, setPlaylist } from '../../reducers/audioReducer';
import classNames from 'classnames/bind';
import { Song,PlaylistData } from '../../model/post/Playlist';

import { getPlaylistDetail } from '../../services/postService';
interface PlaylistDetailProps {
  playlistId: string;
}
const PlaylistDetail : React.FC<PlaylistDetailProps> = ({ playlistId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSong } = useAppSelector(state => state.audio);
  
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cx = classNames.bind(require('../../style/PlaylistDetail.css'));
  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        setLoading(true);
        const response = await getPlaylistDetail(playlistId || '');
        
        if (response.code !== 200) {
          throw new Error('Không thể tải dữ liệu playlist');
        }
        
        setPlaylistData(response.result || { post: {} });

        // Cập nhật playlist vào Redux store
        if (response.result?.post?.content?.songIds) {
          const validSongs = response.result.post.content.songIds
            .filter((song: Song) => song.mediaUrl)
            .map((song: Song) => ({
              id: song.id || Math.random().toString(36).substr(2, 9),
              title: song.title || 'Không có tiêu đề',
              artist: song.artist || 'Nghệ sĩ không xác định',
              imageUrl: song.imageUrl || '/assets/images/default/track-thumbnail.jpg',
              mediaUrl: song.mediaUrl || '/assets/images/default/track-thumbnail.jpg',
            }));
          
          dispatch(setPlaylist(validSongs));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();

    return () => {
      // Reset playlist khi rời khỏi trang
      dispatch(setPlaylist([]));
    };
  }, [playlistId, dispatch]);

  const handleBackClick = () => navigate(-1);

  const handlePlayTrack = (song: Song) => {
    if (!song.mediaUrl) {
      setError('Bài hát không khả dụng');
      return;
    }

    dispatch(playSingleSong({
      id: song.id || Math.random().toString(36).substr(2, 9),
      title: song.title || 'Không có tiêu đề',
      artist: song.artist || 'Nghệ sĩ không xác định',
      imageUrl: song.imageUrl || '/assets/images/default/track-thumbnail.jpg',
      mediaUrl: song.mediaUrl || '/assets/images/default/track-thumbnail.jpg',
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không rõ ngày tạo';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button onClick={handleBackClick} className="back-button">
        <FaArrowLeft /> Quay lại
      </button>
    </div>
  );

  if (!playlistData?.post) return (
    <div className="error-container">
      <div className="error-message">Không tìm thấy playlist</div>
      <button onClick={handleBackClick} className="back-button">
        <FaArrowLeft /> Quay lại
      </button>
    </div>
  );

  const { post } = playlistData;
  const songs = post.content?.songIds || [];
  const hasSongs = songs.length > 0;

  return (
    <div className={cx("playlist-detail-container",classNames)}>
      {/* Header */}
      <div 
        className="playlist-header" 
        style={{ backgroundImage: `url(${post.content?.coverUrl || '/assets/images/default/cover.jpg'})` }}
      >
        <div className="header-overlay">
          <button onClick={handleBackClick} className="back-button">
            <FaArrowLeft />
          </button>
          
          <div className="playlist-header-content">
            <div className="playlist-type-badge">{post.type || 'Playlist'}</div>
            <h1 className="playlist-title">{post.content?.title || 'Không có tiêu đề'}</h1>
            
            {post.content?.description && (
              <p className="playlist-description">{post.content.description}</p>
            )}
            
            <div className="playlist-info">
              <span>{songs.length} bài hát</span>
              <span>Tạo ngày {formatDate(post.created_at)}</span>
              <div className="playlist-stats">
                <span><FaEye /> {post.view_count || 0}</span>
                <span><FaHeart /> {post.like_count || 0}</span>
                <span><FaComment /> {post.comment_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="playlist-content">
        <div className="playlist-main">
          <div className="playlist-cover-section">
            <div className="playlist-cover-wrapper">
              <img 
                src={post.content?.imageUrl || '/assets/images/default/cover.jpg'} 
                alt={post.content?.title} 
                className="playlist-cover"
              />
              
              {hasSongs ? (
                <button 
                  className="play-all-button"
                  onClick={() => handlePlayTrack(songs[0])}
                >
                  Phát tất cả
                </button>
              ) : (
                <div className="empty-playlist-notice">
                  <FaMusic />
                  <span>Playlist trống</span>
                </div>
              )}
            </div>
            
            {post.content?.tags?.length ? (
              <div className="playlist-tags">
                <h3>Thể loại</h3>
                <div className="tags-list">
                  {post.content.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Track list */}
          <div className="tracks-section">
            <h2>Danh sách bài hát</h2>
            
            {hasSongs ? (
              <div className="tracks-list">
                {songs.map((song, index) => (
                  <div 
                    key={index} 
                    className={`track-item ${currentSong?.id === song.id ? 'playing' : ''}`}
                  >
                    <div className="track-number">{index + 1}</div>
                    <img 
                      src={song.imageUrl || '/assets/images/default/track-thumbnail.jpg'} 
                      alt={song.title || `Bài hát ${index + 1}`}
                      className="track-thumbnail"
                    />
                    <div className="track-info">
                      <div className="track-title">{song.title || `Bài hát ${index + 1}`}</div>
                      {song.artist && <div className="track-artist">{song.artist}</div>}
                      {song.tags?.length ? (
                        <div className="track-tags">
                          {song.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="track-tag">#{tag}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {song.mediaUrl ? (
                      <button 
                        className="track-play-button"
                        onClick={() => handlePlayTrack(song)}
                      >
                        <FaPlay />
                      </button>
                    ) : (
                      <div className="track-unavailable">Không khả dụng</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tracks-message">
                <FaMusic className="empty-icon" />
                <p>Playlist chưa có bài hát nào</p>
                <small>Thêm bài hát để bắt đầu nghe</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
