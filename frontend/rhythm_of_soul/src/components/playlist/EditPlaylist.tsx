import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Spinner, Alert, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';
import { FaCheck } from '@react-icons/all-files/fa/FaCheck';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaTimesCircle } from '@react-icons/all-files/fa/FaTimesCircle';
import 'react-datepicker/dist/react-datepicker.css';
import { Track } from '../../model/post/Album';
import { EditPlaylistModalProps } from '../../model/post/Playlist';
import { getTrack, getAlbumDetail, uploadFile } from '../../services/postService';
import { set } from 'react-datepicker/dist/date_utils';

const GENRE_TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP_HOP', 'ELECTRONIC'];

const EditPlaylistModal = ({ show, onHi, onEditPlaylist, postId }: EditPlaylistModalProps) => {
  const [albumData, setAlbumData] = useState({
    title: '',
    isPublic: true,
    tags: [] as string[],
    coverUrl: '',
    imageUrl: '',
    caption :''
  });

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [trackSearch, setTrackSearch] = useState('');
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [preview, setPreview] = useState({
    coverImage: '',
    image: ''
  });
  const [pendingFiles, setPendingFiles] = useState({
    coverImage: null as File | null,
    image: null as File | null
  });
  const [loading, setLoading] = useState({
    tracks: false,
    submit: false,
    initialLoad: false,
    uploadingCover: false,
    uploadingImage: false
  });
  const [error, setError] = useState('');

  // Load album data when modal opens
  useEffect(() => {
    if (!show || !postId) return;

    const loadAlbumData = async () => {
      try {
        setLoading(prev => ({ ...prev, initialLoad: true }));
        const response = await getAlbumDetail(postId);
        
        if (response.code === 200) {
          const album = response.result;
          setAlbumData({
            title: album.post.content.title,
            isPublic: album.post._public,
            tags: album.post.content.tags || [],
            coverUrl: album.post.content.coverUrl,
            imageUrl: album.post.content.imageUrl,
            caption : album.post.caption
          });
          setSelectedTrackIds(album.post.content.songIds.map(track => track.songId));
          setAllTracks(album.post.content.songIds.map(track => ({
            songId: track.songId,
            title: track.title,
            imageUrl: track.imageUrl || '/assets/images/default/track-thumbnail.jpg',
            mediaUrl: track.mediaUrl || '/assets/images/default/track-thumbnail.jpg',
          })));
          setPreview({
            coverImage: album.post.content.coverUrl || '',
            image: album.post.content.imageUrl || ''
          });
        }
      } catch (err) {
        console.error("Error loading album data:", err);
        setError('Failed to load album data');
      } finally {
        setLoading(prev => ({ ...prev, initialLoad: false }));
      }
    };

    loadAlbumData();
  }, [show, postId]);

  // Filter tracks based on search
  useEffect(() => {
    const searchTerm = trackSearch.trim().toLowerCase();
    setFilteredTracks(
      searchTerm 
        ? allTracks.filter(track => track.title.toLowerCase().includes(searchTerm))
        : allTracks
    );
  }, [trackSearch, allTracks]);

  // Handle file upload and preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'coverImage' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(prev => ({ ...prev, [type]: previewUrl }));
    setPendingFiles(prev => ({ ...prev, [type]: file }));
    
    // Upload file immediately
    try {
      const loadingKey = type === 'coverImage' ? 'uploadingCover' : 'uploadingImage';
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      const formData = { file, type: type === 'coverImage' ? 'cover' : 'image' };
      const response = await uploadFile(formData);
      
      if (response.code === 200) {
        const urlKey = type === 'coverImage' ? 'coverUrl' : 'imageUrl';
        setAlbumData(prev => ({ ...prev, [urlKey]: response.result }));
        setError('');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Failed to upload ${type === 'coverImage' ? 'cover image' : 'image'}`);
      // Reset preview and pending file on error
      setPreview(prev => ({ ...prev, [type]: '' }));
      setPendingFiles(prev => ({ ...prev, [type]: null }));
      URL.revokeObjectURL(previewUrl);
    } finally {
      const loadingKey = type === 'coverImage' ? 'uploadingCover' : 'uploadingImage';
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };



  const removeTrack = useCallback((trackId: string) => {
    setSelectedTrackIds(prev => prev.filter(id => id !== trackId));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setAlbumData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setAlbumData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  const handleSubmit = async () => {
    if (!albumData.title.trim()) {
      setError('Please enter an album title');
      return;
    }
    if (selectedTrackIds.length === 0) {
      setError('Please select at least one track');
      return;
    }
  
    // Check if any files are still uploading
    if (loading.uploadingCover || loading.uploadingImage) {
      setError('Please wait for file uploads to complete');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      await onEditPlaylist({
        ...albumData,
        tracks: selectedTrackIds,
        coverUrl: albumData.coverUrl ,
        imageUrl: albumData.imageUrl,
      });
      handleClose();
    } catch (err) {
      console.error("Error updating album:", err);
      setError('Failed to update album. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    if (preview.coverImage) URL.revokeObjectURL(preview.coverImage);
    if (preview.image) URL.revokeObjectURL(preview.image);
    
    setAlbumData({
      title: '',
      isPublic: true,
      tags: [],
      coverUrl: '',
      imageUrl: '',
      caption: ''
    });
    setSelectedTrackIds([]);
    setTrackSearch('');
    setPreview({ coverImage: '', image: '' });
    setPendingFiles({ coverImage: null, image: null });
    setError('');
    onHi();
  };

  const getSelectedTracks = () => {
    return allTracks.filter(track => selectedTrackIds.includes(track.songId));
  };


  if (loading.initialLoad) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading playlist data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Playlist Title *</Form.Label>
            <Form.Control 
              type="text" 
              value={albumData.title}
              onChange={(e) => setAlbumData(prev => ({...prev, title: e.target.value}))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control 
              type="text" 
              value={albumData.caption}
              onChange={(e) => setAlbumData(prev => ({...prev, caption: e.target.value}))}
              required
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Cover Image</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'coverImage')}
                  disabled={loading.uploadingCover}
                />
                {loading.uploadingCover && (
                  <div className="mt-2 text-center">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Uploading cover image...</span>
                  </div>
                )}
                {(preview.coverImage || albumData.coverUrl) && !loading.uploadingCover && (
                  <div className="mt-2 text-center">
                    <img 
                      src={preview.coverImage || albumData.coverUrl} 
                      alt="Cover" 
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Main Image</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'image')}
                  disabled={loading.uploadingImage}
                />
                {loading.uploadingImage && (
                  <div className="mt-2 text-center">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Uploading image...</span>
                  </div>
                )}
                {(preview.image || albumData.imageUrl) && !loading.uploadingImage && (
                  <div className="mt-2 text-center">
                    <img 
                      src={preview.image || albumData.imageUrl} 
                      alt="Main" 
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Genres</Form.Label>
                <div className="mb-2">
                  <div className="d-flex flex-wrap gap-2">
                    {GENRE_TAGS.map(tag => (
                      <Button
                        key={tag}
                        variant={albumData.tags.includes(tag) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className="text-uppercase"
                      >
                        {tag}
                        {albumData.tags.includes(tag) && <FaCheck className="ms-2" />}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {albumData.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {albumData.tags.map(tag => (
                      <Badge key={tag} bg="light" text="dark" className="d-flex align-items-center">
                        {tag}
                        <FaTimesCircle 
                          className="ms-2 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Visibility</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Public"
                checked={albumData.isPublic}
                onChange={() => setAlbumData(prev => ({...prev, isPublic: true}))}
              />
              <Form.Check
                inline
                type="radio"
                label="Private"
                checked={!albumData.isPublic}
                onChange={() => setAlbumData(prev => ({...prev, isPublic: false}))}
              />
            </div>
          </Form.Group>


          {selectedTrackIds.length > 0 && (
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Selected Tracks ({selectedTrackIds.length})</Form.Label>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0"
                  onClick={() => setSelectedTrackIds([])}
                >
                  Clear All
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {getSelectedTracks().map(track => (
                  <div key={track.songId} className="d-flex align-items-center bg-light rounded p-2">
                    <img 
                      src={track.imageUrl} 
                      alt={track.title}
                      width="30"
                      height="30"
                      className="rounded me-2"
                    />
                    <span className="me-2">{track.title}</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger p-0"
                      onClick={() => removeTrack(track.songId)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={
            loading.submit || 
            loading.uploadingCover ||
            loading.uploadingImage ||
            !albumData.title
          }
        >
          {loading.submit ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            'Edit Playlist'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPlaylistModal;