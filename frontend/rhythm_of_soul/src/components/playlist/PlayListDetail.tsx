import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaListUl } from '@react-icons/all-files/fa/FaListUl';
import '../../style/PlaylistDetail.css';
import StreamingPlaybackBar from '../songs/PlaybackBar';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { playSingleSong, setPlaylist } from '../../reducers/audioReducer';
import classNames from 'classnames/bind';
interface Song {
  id: string;
  mediaUrl?: string;
  imageUrl?: string;
  title?: string;
  artist?: string;
  tags?: string[];
}

interface PlaylistData {
  post: {
    content: {
      coverUrl?: string;
      title?: string;
      songIds?: Song[];
      imageUrl?: string;
      tags?: string[];
      description?: string;
    };
    type?: string;
    created_at?: string;
    view_count?: number;
    like_count?: number;
    comment_count?: number;
    caption?: string;
  };
  comments?: {
    user?: { 
      avatar?: string; 
      username?: string 
    };
    created_at?: string;
    content?: string;
  }[];
  isLiked?: boolean;
}

const PlaylistDetail = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSong } = useAppSelector(state => state.audio);
  
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const cx = classNames.bind(require('../../style/PlaylistDetail.css'));
  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8484/posts/detailPost/${playlistId}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu playlist');
        }
        
        const data = await response.json();
        console.log(data);
        setPlaylistData(data.result || { post: {} });
        setIsLiked(data.result?.isLiked || false);

        // Cập nhật playlist vào Redux store
        if (data.result?.post?.content?.songIds) {
          const validSongs = data.result.post.content.songIds
            .filter((song: Song) => song.mediaUrl)
            .map((song: Song) => ({
              id: song.id || Math.random().toString(36).substr(2, 9),
              title: song.title || 'Không có tiêu đề',
              artist: song.artist || 'Nghệ sĩ không xác định',
              coverUrl: song.imageUrl || '/assets/images/default/track-thumbnail.jpg',
              audioUrl:song.mediaUrl || '/assets/images/default/track-thumbnail.jpg',
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

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8484/posts/${playlistId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setPlaylistData(prev => ({
          ...prev!,
          post: {
            ...prev!.post,
            like_count: (prev!.post.like_count || 0) + (isLiked ? -1 : 1)
          }
        }));
      }
    } catch (err) {
      console.error('Lỗi khi like:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8484/posts/${playlistId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setPlaylistData(prev => ({
          ...prev!,
          comments: [
            ...(prev?.comments || []),
            {
              user: { username: 'Bạn', avatar: '/assets/images/default/avatar.jpg' },
              created_at: new Date().toISOString(),
              content: newComment
            }
          ],
          post: {
            ...prev!.post,
            comment_count: (prev!.post.comment_count || 0) + 1
          }
        }));
        setNewComment('');
      }
    } catch (err) {
      console.error('Lỗi khi bình luận:', err);
    }
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
            
            <div className="playlist-actions">
              <button 
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                {isLiked ? 'Đã thích' : 'Thích'}
              </button>
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

        {/* Comments section */}
        <div className="comments-section">
          <h2>Bình luận ({post.comment_count || 0})</h2>
          
          {playlistData.comments?.length ? (
            <div className="comments-list">
              {playlistData.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <img 
                    src={comment.user?.avatar || '/assets/images/default/avatar.jpg'} 
                    alt={comment.user?.username} 
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-username">{comment.user?.username || 'Ẩn danh'}</span>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <div className="comment-text">{comment.content || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
          )}
          
          <form onSubmit={handleCommentSubmit} className="add-comment">
            <textarea 
              placeholder="Viết bình luận..." 
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button 
              type="submit" 
              className="comment-submit"
              disabled={!newComment.trim()}
            >
              Đăng
            </button>
          </form>
        </div>
      </div>

      {/* Player bar */}
      <StreamingPlaybackBar />
    </div>
  );
};

export default PlaylistDetail;