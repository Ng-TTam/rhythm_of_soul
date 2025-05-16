import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Form } from 'react-bootstrap';
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { FaPause } from '@react-icons/all-files/fa/FaPause';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { FaTag } from '@react-icons/all-files/fa/FaTag';
import { FaGlobeAmericas } from '@react-icons/all-files/fa/FaGlobeAmericas';
import { FaLock } from '@react-icons/all-files/fa/FaLock';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { FaUser } from '@react-icons/all-files/fa/FaUser';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaShare } from '@react-icons/all-files/fa/FaShare';
import { FaDownload } from '@react-icons/all-files/fa/FaDownload';
import { FaListUl } from '@react-icons/all-files/fa/FaListUl';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toggleePlay, setAudio } from '../../reducers/audioReducer';
import { Comment, DetailPostResponse} from '../../model/post/Album';
import { getAlbumDetail } from '../../services/postService';
const AlbumDetailView = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const audioState = useAppSelector(state => state.audio);
  
  const [albumDetail, setAlbumDetail] = useState<DetailPostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');

  // Fetch album details
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      if (!albumId) return;
      
      try {
        setLoading(true);
        const response = await getAlbumDetail(albumId);
        if (response.code !== 200) {
          throw new Error(`Failed to fetch album details: ${response.message}`);
        }
        
        
        if (response.code === 200 && response.result) {
          setAlbumDetail(response.result);
          setIsLiked(response.result.likes.includes("1234")); // Replace with actual user ID
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching album details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [albumId]);

  // Handle like
  const handleLike = async () => {
    if (!albumDetail) return;
    
    try {
      setIsLiked(prev => !prev);
      setAlbumDetail(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          post: {
            ...prev.post,
            like_count: prev.post.like_count + (isLiked ? -1 : 1)
          },
          likes: isLiked 
            ? prev.likes.filter(userId => userId !== "1234") 
            : [...prev.likes, "1234"]
        };
      });
    } catch (err) {
      console.error("Error liking album:", err);
    }
  };

  // Handle song play
  const playSong = (index: number) => {
    if (!albumDetail) return;
    
    const song = albumDetail.post.content.songIds[index];
    
    if (audioState.mediaUrlSong === song.mediaUrl) {
      dispatch(toggleePlay(!audioState.play));
    } else {
      setCurrentSongIndex(index);
      dispatch(setAudio({
        play: true,
        imageSong: song.imageUrl,
        titleSong: song.title,
        artistSong: song.artist || albumDetail.post.user_id,
        mediaUrlSong: song.mediaUrl
      }));
    }
  };

  // Play/pause current song
  const togglePlayPause = () => {
    if (!albumDetail) return;
    
    if (currentSongIndex >= 0) {
      playSong(currentSongIndex);
    } else if (albumDetail.post.content.songIds.length > 0) {
      playSong(0);
    }
  };

  // Handle next song
  const playNextSong = () => {
    if (!albumDetail) return;
    
    const totalSongs = albumDetail.post.content.songIds.length;
    if (totalSongs === 0) return;
    
    const nextIndex = (currentSongIndex + 1) % totalSongs;
    playSong(nextIndex);
  };

  // Handle previous song
  const playPreviousSong = () => {
    if (!albumDetail) return;
    
    const totalSongs = albumDetail.post.content.songIds.length;
    if (totalSongs === 0) return;
    
    const prevIndex = (currentSongIndex - 1 + totalSongs) % totalSongs;
    playSong(prevIndex);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !albumDetail) return;
    
    try {
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        content: commentText,
        account_id: "1234",
        username: "Current User",
        avatar: "https://via.placeholder.com/40",
        created_at: new Date().toISOString()
      };
      
      setAlbumDetail(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          post: {
            ...prev.post,
            comment_count: prev.post.comment_count + 1
          },
          comments: [...prev.comments, newComment]
        };
      });
      
      setCommentText('');
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading album details...</p>
      </Container>
    );
  }

  if (error || !albumDetail) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error loading album details</h4>
          <p>{error || "Album not found"}</p>
          <hr />
          <Button variant="outline-primary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Container>
    );
  }

  const { post, comments } = albumDetail;
  const currentSong = currentSongIndex >= 0 ? post.content.songIds[currentSongIndex] : null;
  const isCurrentSongPlaying = currentSong && audioState.play && audioState.mediaUrlSong === currentSong.mediaUrl;

  return (
    <Container className="py-4">
      {/* Album Header */}
      <div 
        className="position-relative rounded mb-4 text-white"
        style={{
          height: '240px',
          backgroundImage: `url(${post.content.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark-gradient rounded"></div>
        
        {/* Content */}
        <div className="position-absolute top-0 start-0 w-100 h-100 p-4 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaMusic color="white" size={20} />
              </div>
              <div className="ms-3">
                <div className="text-white fw-bold fs-5">Album</div>
                <Badge bg={post._public ? 'success' : 'warning'} className="d-flex align-items-center" style={{ width: 'fit-content' }}>
                  {post._public ?
                    <><FaGlobeAmericas size={10} className="me-1" /> Public</> :
                    <><FaLock size={10} className="me-1" /> Private</>
                  }
                </Badge>
              </div>
            </div>
            <Button variant="outline-light" size="sm" onClick={() => navigate(-1)}>
              Back to Albums
            </Button>
          </div>
          
          <div>
            <h1 className="display-5 fw-bold">{post.content.title}</h1>
            <p className="mb-0 text-white-50">
              <FaCalendarAlt className="me-2" />
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </div>

      <Row>
        {/* Album Content */}
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                {/* Album Image */}
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="position-relative rounded overflow-hidden shadow" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={post.content.imageUrl}
                      alt={post.content.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
                      style={{ cursor: 'pointer' }}
                      onClick={togglePlayPause}
                    >
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        {isCurrentSongPlaying ?
                          <FaPause size={32} className="text-primary" /> :
                          <FaPlay size={32} className="text-primary" />
                        }
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Album Info */}
                <Col md={8}>
                  <h2 className="fs-3 mb-3">{post.content.title}</h2>
                  
                  {post.caption && (
                    <p className="text-muted mb-3">{post.caption}</p>
                  )}
                  
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    {post.content.tags.map((tag, index) => (
                      <Badge key={index} bg="light" text="primary" className="d-flex align-items-center">
                        <FaTag size={10} className="me-1" />
                        {tag.toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex text-muted mb-2">
                      <div className="me-4 d-flex align-items-center">
                        <FaMusic className="me-2" />
                        <span>{post.content.songIds.length} tracks</span>
                      </div>
                      <div className="me-4 d-flex align-items-center">
                        <FaEye className="me-2" />
                        <span>{post.view_count} views</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Button
                      variant={isLiked ? "danger" : "outline-danger"}
                      className="d-flex align-items-center"
                      onClick={handleLike}
                    >
                      {isLiked ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
                      {post.like_count}
                    </Button>
                    
                    <Button variant="outline-secondary" className="d-flex align-items-center">
                      <FaComment className="me-2" />
                      {post.comment_count}
                    </Button>
                    
                    <Button variant="outline-primary" className="d-flex align-items-center">
                      <FaShare className="me-2" />
                      Share
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tracks List */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h3 className="fs-5 mb-0 d-flex align-items-center">
                <FaListUl className="me-2" />
                Tracks
              </h3>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {post.content.songIds.map((song, index) => {
                  const isCurrent = currentSongIndex === index;
                  const isPlayingCurrent = isCurrent && audioState.play && audioState.mediaUrlSong === song.mediaUrl;
                  
                  return (
                    <div 
                      key={song.songId}
                      className={`list-group-item list-group-item-action d-flex align-items-center ${isCurrent ? 'active bg-light text-dark' : ''}`}
                    >
                      <div className="me-3" style={{ width: '30px', textAlign: 'center' }}>
                        {isPlayingCurrent ? (
                          <div className="equalizer">
                            <span></span><span></span><span></span>
                          </div>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      <div 
                        className="me-3 position-relative rounded-circle overflow-hidden"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <img 
                          src={song.imageUrl} 
                          alt={song.title}
                          className="w-100 h-100 object-fit-cover"
                        />
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => playSong(index)}
                        >
                          {isPlayingCurrent ? (
                            <FaPause size={16} className="text-white" />
                          ) : (
                            <FaPlay size={16} className="text-white" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-grow-1" onClick={() => playSong(index)} style={{ cursor: 'pointer' }}>
                        <div className="fw-bold">{song.title}</div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {song.tags.map((tag, idx) => (
                            <Badge 
                              key={idx} 
                              bg="light" 
                              text="secondary" 
                              className="small"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {tag.toLowerCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        variant="link" 
                        className="text-muted p-0"
                        title="Download"
                      >
                        <FaDownload />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* Comments */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h3 className="fs-5 mb-0 d-flex align-items-center">
                <FaComment className="me-2" />
                Comments ({post.comment_count})
              </h3>
            </Card.Header>
            <Card.Body>
              {/* Comment form */}
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="primary">
                    Post Comment
                  </Button>
                </div>
              </Form>
              
              <hr />
              
              {/* Comments list */}
              {comments.length === 0 ? (
                <p className="text-center text-muted my-4">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="comment-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="d-flex mb-4">
                      <div className="me-3">
                        <img
                          src={comment.avatar || "https://via.placeholder.com/40"}
                          alt={comment.username}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="mb-0 fw-bold">{comment.username}</h6>
                          <small className="text-muted">{formatDate(comment.created_at)}</small>
                        </div>
                        <p className="mb-0">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right Sidebar */}
        <Col lg={4}>
          {/* Now Playing */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h3 className="fs-5 mb-0">Now Playing</h3>
            </Card.Header>
            <Card.Body>
              {currentSong ? (
                <div>
                  <div className="text-center mb-3">
                    <div className="position-relative rounded overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                      <img
                        src={currentSong.imageUrl}
                        alt={currentSong.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <h5 className="mb-1">{currentSong.title}</h5>
                    <div className="text-muted small">
                      {currentSong.tags.map(tag => tag.toLowerCase()).join(', ')}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline-secondary" onClick={playPreviousSong}>
                      Previous
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={togglePlayPause}
                    >
                      {isCurrentSongPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button variant="outline-secondary" onClick={playNextSong}>
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaMusic size={48} className="text-muted mb-3" />
                  <p className="mb-0">Select a track to start playing</p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Album Info */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h3 className="fs-5 mb-0">About Album</h3>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="fw-bold text-muted mb-1">Owner</div>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                    <FaUser color="white" size={16} />
                  </div>
                  <div>User #{post.user_id}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-muted mb-1">Created</div>
                <div>{formatDate(post.created_at)}</div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-muted mb-1">Tracks</div>
                <div>{post.content.songIds.length}</div>
              </div>
              
              <div>
                <div className="fw-bold text-muted mb-1">Tags</div>
                <div className="d-flex flex-wrap gap-2">
                  {post.content.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="primary">
                      {tag.toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CSS for audio player animations */}
      <style>{`
        .bg-dark-gradient {
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
        }
        
        .equalizer {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 20px;
        }
        
        .equalizer span {
          display: inline-block;
          width: 3px;
          height: 100%;
          margin: 0 1px;
          background-color: #007bff;
          animation: equalize 1.2s ease-in-out infinite;
        }
        
        .equalizer span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .equalizer span:nth-child(2) {
          animation-delay: 0.4s;
        }
        
        .equalizer span:nth-child(3) {
          animation-delay: 0.8s;
        }
        
        @keyframes equalize {
          0%, 100% {
            height: 5px;
          }
          50% {
            height: 20px;
          }
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </Container>
  );
};

export default AlbumDetailView;