import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Spinner, Nav, Tab } from 'react-bootstrap';
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
import { FaFilter } from '@react-icons/all-files/fa/FaFilter';
import { useNavigate } from 'react-router-dom';
const AlbumPost = () => {
  interface Album {
    id: string;
    title: string;
    tracks: number;
    isPublic: boolean;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    coverUrl: string;
    imageUrl: string;
    tags?: string[];
    crateAt: string;
  }

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAlbumId, setPlayingAlbumId] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch albums from the API
    const fetchAlbums = async () => {
      try {
        // Replace with the actual user ID
        const userId = "1234";
        const response = await fetch(`http://localhost:8484/posts/${userId}/album`);

        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }

        const data = await response.json();
        if (data.code === 0 && Array.isArray(data.result)) {
          setAlbums(data.result);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching albums:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);
  const navigate = useNavigate();
  const handleClickPost = (albumId: string) => {
    // Navigate to the album detail page
    
    navigate(`/albums/${albumId}`);
  }
  // Handle play/pause for an album
  // Removed misplaced code block as 'album' is not defined in this scope
  const handleLike = (albumId: string) => {
    setLikedAlbums(prev => {
      const isCurrentlyLiked = prev[albumId];
      const newLikedState = { ...prev, [albumId]: !isCurrentlyLiked };

      // In a real app, you would send a request to your backend
      // Update album like count locally for now
      setAlbums(albums.map(album => {
        if (album.id === albumId) {
          return {
            ...album,
            likeCount: album.likeCount + (isCurrentlyLiked ? -1 : 1)
          };
        }
        return album;
      }));

      return newLikedState;
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter albums based on active tab
  const getFilteredAlbums = () => {
    switch (activeTab) {
      case 'public':
        return albums.filter(album => album.isPublic);
      case 'private':
        return albums.filter(album => !album.isPublic);
      default:
        return albums;
    }
  };

  // Count albums by visibility
  const publicCount = albums.filter(album => album.isPublic).length;
  const privateCount = albums.filter(album => !album.isPublic).length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error loading albums</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <Card className="text-center p-5 bg-light border-dashed">
        <Card.Body>
          <FaMusic size={48} className="text-secondary mb-3" />
          <h3>No albums found</h3>
          <p className="text-muted">Start creating your first album!</p>
        </Card.Body>
      </Card>
    );
  }

  const filteredAlbums = getFilteredAlbums();

  return (
    <Container style={{ maxWidth: "100%" }}>

      {/* Filter tabs */}
      <Tab.Container
        id="album-tabs"
        activeKey={activeTab}
        onSelect={(eventKey) => {
          if (eventKey) {
            setActiveTab(eventKey);
          }
        }}
      >
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="all" className="d-flex align-items-center">
              <FaFilter className="me-2" />
              All <Badge bg="secondary" className="ms-2">{albums.length}</Badge>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="public" className="d-flex align-items-center">
              <FaGlobeAmericas className="me-2" />
              Public <Badge bg="success" className="ms-2">{publicCount}</Badge>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="private" className="d-flex align-items-center">
              <FaLock className="me-2" />
              Private <Badge bg="warning" className="ms-2">{privateCount}</Badge>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={activeTab}>
            {filteredAlbums.length === 0 ? (
              <Card className="text-center p-4 bg-light">
                <Card.Body>
                  <p className="text-muted mb-0">No {activeTab !== 'all' ? activeTab : ''} albums found</p>
                </Card.Body>
              </Card>
            ) : (
              <Row xs={1} md={1} className="g-4" style={{ maxWidth: "100%",alignContent : "center",justifyContent : "center" }}>
            {filteredAlbums.map(album => (
              <Col key={album.id} style={{ maxWidth: "90%" }}>
                <Card className="h-100 shadow-sm hover-lift">
                  {/* Banner with cover image */}
                  <div
                    className="position-relative"
                    style={{
                      height: '150px',
                      backgroundImage: `url(${album.coverUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark-gradient"></div>

                    {/* Header content */}
                    <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center" >
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <FaMusic color="white" size={16} />
                        </div>
                        <div className="ms-2">
                          <div className="text-black fw-bold">Album</div>
                          <small className="text-black-50">{formatDate(album.crateAt)}</small>
                        </div>
                      </div>
                      <Badge bg={album.isPublic ? 'success' : 'warning'} className="d-flex align-items-center">
                        {album.isPublic ?
                          <><FaGlobeAmericas size={10} className="me-1" /> Public</> :
                          <><FaLock size={10} className="me-1" /> Private</>
                        }
                      </Badge>
                    </div>

                    {/* Banner content */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3">
                      <h2 className="text-black fw-bold text-truncate">{album.title}</h2>
                      <div className="text-black-50 small d-flex align-items-center">
                        <FaMusic size={12} className="me-1" />
                        <span>{album.tracks} tracks</span>
                      </div>
                    </div>
                  </div>

                  <Card.Body onClick={() => handleClickPost(album.id)}>
                    <Row>
                      {/* Album cover */}
                      <Col md={5} className="mb-3 mb-md-0" style={{ width: '20%', marginRight: '10%' }}>
                        <div className="position-relative rounded overflow-hidden shadow-sm" style={{ aspectRatio: '1/1' }}>
                          <img
                            src={album.imageUrl}
                            alt={album.title}
                            className="w-100 h-100 object-fit-cover"
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100"
                            style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}

                          >
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                              {playingAlbumId === album.id ?
                                <FaPause size={24} className="text-primary" /> :
                                <FaPlay size={24} className="text-primary" />
                              }
                            </div>
                          </div>
                          {/* Album status indicator */}
                          {playingAlbumId === album.id && (
                            <Badge bg="primary" className="position-absolute bottom-0 end-0 m-2 pulse">
                              Now Playing
                            </Badge>
                          )}
                        </div>
                      </Col>

                      {/* Album details */}
                      <Col md={7}>
                        {/* Tags */}
                        <div className="mb-3 d-flex flex-wrap gap-2">
                          {album.tags?.map((tag, index) => (
                            <Badge key={index} bg="light" text="primary" className="d-flex align-items-center">
                              <FaTag size={10} className="me-1" />
                              {tag.toLowerCase()}
                            </Badge>
                          ))}
                        </div>

                        {/* Basic album info */}
                        <Card className="bg-light border-0">
                          <Card.Body>
                            <Row className="mb-2">
                              <Col xs={4} className="fw-bold text-muted">Album:</Col>
                              <Col>{album.title}</Col>
                            </Row>
                            <Row className="mb-2">
                              <Col xs={4} className="fw-bold text-muted">Tracks:</Col>
                              <Col>{album.tracks}</Col>
                            </Row>
                            <Row>
                              <Col xs={4} className="fw-bold text-muted">Visibility:</Col>
                              <Col className={`text-${album.isPublic ? 'success' : 'warning'} d-flex align-items-center`}>
                                {album.isPublic ?
                                  <><FaGlobeAmericas size={12} className="me-1" /> Public</> :
                                  <><FaLock size={12} className="me-1" /> Private</>
                                }
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>

                  {/* Action buttons */}
                  <Card.Footer className="bg-white border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        variant={likedAlbums[album.id] ? "danger" : "light"}
                        size="sm"
                        className="d-flex align-items-center"
                        onClick={() => handleLike(album.id)}
                      >
                        {likedAlbums[album.id] ?
                          <FaHeart size={16} className="me-2" /> :
                          <FaRegHeart size={16} className="me-2" />
                        }
                        <span>{album.likeCount || 0}</span>
                      </Button>

                      <Button
                        variant="light"
                        size="sm"
                        className="d-flex align-items-center"
                      >
                        <FaComment size={16} className="me-2" />
                        <span>{album.commentCount || 0}</span>
                      </Button>

                      <div className="d-flex align-items-center text-muted">
                        <FaEye size={16} className="me-2" />
                        <span>{album.viewCount || 0}</span>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            )}
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
    </Container >
  );
};

// Add these CSS styles to your global CSS file
const globalStyles = `
  .bg-dark-gradient {
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
  }
  
  .hover-lift {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
  
  .hover-opacity-100:hover {
    opacity: 1 !important;
  }
  
  .object-fit-cover {
    object-fit: cover;
  }
  
  .border-dashed {
    border-style: dashed !important;
  }
  
  .pulse {
    animation: pulse-animation 2s infinite;
  }
  
  @keyframes pulse-animation {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  .text-white-50 {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export default AlbumPost;