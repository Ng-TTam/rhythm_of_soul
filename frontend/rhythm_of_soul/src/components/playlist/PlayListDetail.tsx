import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/PlaylistDetail.css';

const PlaylistDetail = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  console.log('Playlist ID:', playlistId);
  const navigate = useNavigate();
  interface PlaylistData {
    post: {
      content: {
        coverUrl: string;
        title: string;
        songIds: { mediaUrl: string; imageUrl: string; title: string; tags?: string[] }[];
        imageUrl: string;
        tags?: string[];
      };
      type: string;
      created_at: string;
      view_count: number;
      like_count: number;
      comment_count: number;
      caption?: string;
    };
    comments?: {
      user?: { avatar?: string; username?: string };
      created_at: string;
      content: string;
    }[];
  }
  
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await fetch(`http://localhost:8484/posts/detailPost/${playlistId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlist data');
        }
        const data = await response.json();
        setPlaylistData(data.result);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [playlistId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePlayTrack = (index: number) => {
    if (currentTrackIndex === index && isPlaying) {
      // Pause current track
      audioRef?.pause();
      setIsPlaying(false);
    } else if (currentTrackIndex === index && !isPlaying) {
      // Resume current track
      audioRef?.play();
      setIsPlaying(true);
    } else {
      // Play new track
      if (audioRef) {
        audioRef.pause();
      }
      
      if (!playlistData || !playlistData.post) {
        console.error('Playlist data is null or undefined');
        return;
      }
      const newAudio = new Audio(getMediaUrl(playlistData.post.content.songIds[index].mediaUrl));
      newAudio.onended = () => {
        if (index < playlistData.post.content.songIds.length - 1) {
          handlePlayTrack(index + 1);
        } else {
          setCurrentTrackIndex(null);
          setIsPlaying(false);
        }
      };
      
      setAudioRef(newAudio);
      newAudio.play();
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const getMediaUrl = (mediaUrl:string) => {
    // Adjust this based on your actual media URL structure
    return `http://localhost:9000/media/${mediaUrl}`;
  };

  const formatDate = (dateString : string)  => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!playlistData || !playlistData.post) return <div className="error-message">No playlist data available</div>;

  const { post } = playlistData;

  return (
    <div className="playlist-detail-container">
      {/* Header with background image */}
      <div 
        className="playlist-header" 
        style={{ backgroundImage: `url(${post.content.coverUrl})` }}
      >
        <div className="header-overlay">
          <div className="playlist-header-content">
            <div className="playlist-type-badge">{post.type}</div>
            <h1 className="playlist-title">{post.content.title}</h1>
            <div className="playlist-info">
              <span>{post.content.songIds.length} tracks</span>
              <span>Created on {formatDate(post.created_at)}</span>
              <div className="playlist-stats">
                <span><i className="icon-view"></i> {post.view_count} views</span>
                <span><i className="icon-like"></i> {post.like_count} likes</span>
                <span><i className="icon-comment"></i> {post.comment_count} comments</span>
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
                src={post.content.imageUrl} 
                alt={post.content.title} 
                className="playlist-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default/cover.jpg';
                }}
              />
              <button 
                className={`play-all-button ${isPlaying && currentTrackIndex === 0 ? 'playing' : ''}`}
                onClick={() => handlePlayTrack(0)}
              >
                {isPlaying && currentTrackIndex === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {isPlaying && currentTrackIndex === 0 ? 'Pause' : 'Play All'}
              </button>
            </div>
            
            {post.content.tags && post.content.tags.length > 0 && (
              <div className="playlist-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {post.content.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="tracks-section">
            <h2>Tracks</h2>
            <div className="tracks-list">
              {post.content.songIds.map((song, index) => (
                <div 
                  key={index} 
                  className={`track-item ${currentTrackIndex === index ? 'playing' : ''}`}
                >
                  <div className="track-number">{index + 1}</div>
                  <img 
                    src={song.imageUrl} 
                    alt={song.title}
                    className="track-thumbnail"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/default/track-thumbnail.jpg';
                    }}
                  />
                  <div className="track-info">
                    <div className="track-title">{song.title}</div>
                    {song.tags && (
                      <div className="track-tags">
                        {song.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="track-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    className="track-play-button"
                    onClick={() => handlePlayTrack(index)}
                  >
                    {currentTrackIndex === index && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="comments-section">
          <h2>Comments ({post.comment_count})</h2>
          {playlistData.comments && playlistData.comments.length > 0 ? (
            <div className="comments-list">
              {playlistData.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <img 
                    src={comment.user?.avatar || '/assets/images/default/avatar.jpg'} 
                    alt={comment.user?.username} 
                    className="comment-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/default/avatar.jpg';
                    }}
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-username">{comment.user?.username || 'Anonymous'}</span>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <div className="comment-text">{comment.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">No comments yet. Be the first to comment!</div>
          )}
          
          <div className="add-comment">
            <textarea 
              placeholder="Add your comment..." 
              className="comment-input"
            ></textarea>
            <button className="comment-submit">Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;