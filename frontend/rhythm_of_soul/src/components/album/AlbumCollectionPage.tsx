import React, { useState, useEffect } from 'react';
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
import { 
  Card, Container, Row, Col, Button, Badge, Spinner, Nav, Tab, Alert 
} from 'react-bootstrap';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import AddAlbumModal from './AddAlbumForm';
import { Album, AlbumResponse } from '../../model/post/Album';
import { getAlbumOfUser, uploadFile, createALbum, unlikePost, likePost, updateAlbum } from '../../services/postService';
import { getAccessToken, DecodedToken } from '../../utils/tokenManager';
import { jwtDecode } from 'jwt-decode';
import EditAlbumModal from './EditAlbum';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';

const AlbumPost = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAlbumId, setPlayingAlbumId] = useState<string | null>(null);
  const [likedAlbums, setLikedAlbums] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  let accountId = "";
  let isArtist = false;
  
  if (accessToken) {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    accountId = decoded.sub;
    isArtist = decoded.scope === 'ROLE_ARTIST';
  }
  
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await getAlbumOfUser(accountId);

        if (response.code === 200 && Array.isArray(response.result)) {
          setAlbums(response.result);
          const initialLikedState: Record<string, boolean> = {};
          response.result.forEach(album => {
            initialLikedState[album.id] = album.isLiked;
          });
          setLikedAlbums(initialLikedState);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [accountId]);

  const handleClickPost = (albumId: string) => {
    navigate(`/post/${albumId}`);
  };

  const handleLike = async (albumId: string) => {
    const alreadyLiked = likedAlbums[albumId];
    
    try {
      if (alreadyLiked) {
        await unlikePost(albumId);
      } else {
        await likePost(albumId);
      }
      
      setAlbums(prev =>
        prev.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              likeCount: album.likeCount + (alreadyLiked ? -1 : 1),
              isLiked: !alreadyLiked
            };
          }
          return album;
        }));
      
      setLikedAlbums(prev => ({
        ...prev,
        [albumId]: !alreadyLiked
      }));
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const handleAddAlbum = async (newAlbumData: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverImage: File | null;
    image: File | null;
    scheduleAt: Date | null;
    tracks: string[];
  }) => {
    try {
      let cover = '';
      let image = '';
  
      if (newAlbumData.coverImage) {
        const coverResponse = await uploadFile({
          file: newAlbumData.coverImage,
          type: 'cover'
        });
        cover = coverResponse.result;
      }
  
      if (newAlbumData.image) {
        const imageResponse = await uploadFile({
          file: newAlbumData.image,
          type: 'image'
        });
        image = imageResponse.result;
      }

      const requestBody = {
        title: newAlbumData.title,
        isPublic: newAlbumData.isPublic,
        tags: newAlbumData.tags,
        cover,
        image,
        scheduleAt: newAlbumData.scheduleAt?.toISOString(),
        songIds: newAlbumData.tracks
      };

      const response = await createALbum(requestBody);
  
      if (response.code === 200) {
        setAlbums(prev => [response.result, ...prev]);
        return Promise.resolve();
      }
      throw new Error(response.message || 'Failed to add album');
    } catch (err) {
      console.error("Error adding album:", err);
      return Promise.reject(err);
    }
  };

  const handleEditAlbum = async (updatedAlbumData: {
    title: string;
    isPublic: boolean;
    tags: string[];
    coverUrl: string;
    imageUrl: string;
    scheduleAt: Date | null;
    tracks: string[];
    caption?: string;
  }) => {
    if (!editingAlbumId) return;
    console.log("Update:", updatedAlbumData);
    try {

      const requestBody = {
        title: updatedAlbumData.title,
        isPublic: updatedAlbumData.isPublic,
        tags: updatedAlbumData.tags,
        coverUrl: updatedAlbumData.coverUrl,
        imageUrl: updatedAlbumData.imageUrl,
        scheduleAt: updatedAlbumData.scheduleAt?.toISOString(),
        songIds: updatedAlbumData.tracks,
        caption: updatedAlbumData.caption
      };

      const response = await updateAlbum(editingAlbumId, requestBody);
      console.log("Response:", response);
      if (response.code === 200) {
        setAlbums(prev => 
          prev.map(album => 
            album.id === editingAlbumId ? response.result : album
          )
        );
        setEditingAlbumId(null);
        return Promise.resolve();
      }
      throw new Error(response.message || 'Failed to update album');
    } catch (err) {
      console.error("Error updating album:", err);
      return Promise.reject(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const publicCount = albums.filter(album => album.isPublic).length;
  const privateCount = albums.filter(album => !album.isPublic).length;
  const filteredAlbums = getFilteredAlbums();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error loading albums</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '100%' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Music Albums</h2>
        {isArtist && (
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" />
            New Album
          </Button>
        )}
      </div>

      <Tab.Container
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k)}
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
          <Tab.Pane eventKey={activeTab} style={{width: "100%"}}>
            {filteredAlbums.length === 0 ? (
              <Card className="text-center p-5 bg-light border-dashed">
                <Card.Body>
                  <FaMusic size={48} className="text-secondary mb-3" />
                  <h3>No albums found</h3>
                  <p className="text-muted">Start by creating a new album!</p>
                  {isArtist && (
                    <Button 
                      variant="primary" 
                      onClick={() => setShowAddModal(true)}
                      className="mt-3"
                    >
                      <FaPlus className="me-2" />
                      Create Album
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4" style={{width: "100%", justifyContent: "center"}}>
                {filteredAlbums.map(album => (
                  <Col key={album.id} style={{width: "80%"}}>
                    <Card className="h-100 shadow-sm hover-lift">
                      <div
                        className="position-relative"
                        style={{
                          height: '150px',
                          backgroundImage: `url(${album.coverUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark-gradient"></div>
                        <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                                 style={{ width: '40px', height: '40px' }}>
                              <FaMusic color="white" size={16} />
                            </div>
                            <div className="ms-2">
                              <div className="text-white fw-bold">Album</div>
                              <small className="text-white-50">{formatDate(album.createdAt)}</small>
                            </div>
                          </div>
                          <Badge bg={album.isPublic ? 'success' : 'warning'}>
                            {album.isPublic ? 'Public' : 'Private'}
                          </Badge>
                          {isArtist && (
                            <button 
                              style={{justifyItems: "end"}} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAlbumId(album.id);
                              }}
                            >
                              <FaEllipsisH />
                            </button>
                          )}
                        </div>
                        <div className="position-absolute bottom-0 start-0 w-100 p-3">
                          <h2 className="text-white fw-bold">{album.title}</h2>
                          
                          <div className="text-white-50 small">
                          
                            <FaMusic size={12} className="me-1" />
                            {album.tracks} tracks
                          </div>
                        </div>
                      </div>

                      <Card.Body onClick={() => handleClickPost(album.id)}>
                        <Row>
                          <Col md={5} className="mb-3 mb-md-0">
                            <div className="position-relative rounded overflow-hidden shadow-sm" 
                                 style={{ aspectRatio: "1 / 1", width: "100%", height: "100%" }}>
                              <img
                                src={album.imageUrl}
                                alt={album.title}
                                className="w-100 h-100 object-fit-cover"
                              />
                              <div
                                className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100"
                                style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                              >
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                                     style={{ width: '60px', height: '60px' }}>
                                  {playingAlbumId === album.id ? 
                                    <FaPause size={24} className="text-primary" /> : 
                                    <FaPlay size={24} className="text-primary" />
                                  }
                                </div>
                              </div>
                              {playingAlbumId === album.id && (
                                <Badge bg="primary" className="position-absolute bottom-0 end-0 m-2 pulse">
                                  Now Playing
                                </Badge>
                              )}
                            </div>
                          </Col>

                          <Col md={7}>
                            {album.tags && album.tags.length > 0 && (
                              <div className="mb-3 d-flex flex-wrap gap-2">
                                {album.tags.map((tag, index) => (
                                  <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                                    <FaTag size={10} className="me-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <Card className="bg-light border-0">
                              <Card.Body>
                                <Row className="mb-2">
                                  <Col xs={4} className="fw-bold text-muted">Album:</Col>
                                  <Col>{album.title}</Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col xs={4} className="fw-bold text-muted">Caption:</Col>
                                  <Col>{album.caption}</Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col xs={4} className="fw-bold text-muted">Songs:</Col>
                                  <Col>{album.tracks}</Col>
                                </Row>
                                <Row>
                                  <Col xs={4} className="fw-bold text-muted">Visibility:</Col>
                                  <Col className={`text-${album.isPublic ? 'success' : 'warning'}`}>
                                    {album.isPublic ? 'Public' : 'Private'}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Card.Body>

                      <Card.Footer className="bg-white border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            variant={likedAlbums[album.id] ? "danger" : "light"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(album.id);
                            }}
                            className="d-flex align-items-center"
                          >
                            {likedAlbums[album.id] ? 
                              <FaHeart className="me-2" /> : 
                              <FaRegHeart className="me-2" />
                            }
                            {album.likeCount || 0}
                          </Button>

                          <Button
                            variant="light"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClickPost(album.id);
                            }}
                          >
                            <FaComment className="me-2" />
                            {album.commentCount || 0}
                          </Button>

                          <div className="d-flex align-items-center text-muted">
                            <FaEye className="me-2" />
                            {album.viewCount || 0}
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

      <AddAlbumModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddAlbum={handleAddAlbum}
      />
      
      {editingAlbumId && (
        <EditAlbumModal 
          show={!!editingAlbumId}
          onHi={() => setEditingAlbumId(null)}
          onEditAlbum={handleEditAlbum}
          postId={editingAlbumId}
        />
      )}
    </Container>
  );
};

export default AlbumPost;