import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Spinner, Alert, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';
import { FaCheck } from '@react-icons/all-files/fa/FaCheck';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaTimesCircle } from '@react-icons/all-files/fa/FaTimesCircle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Track, EditAlbumModalProps } from '../../model/post/Album';
import { getTrack, getAlbumDetail, uploadFile } from '../../services/postService';

const GENRE_TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP_HOP', 'ELECTRONIC'];

const EditAlbumModal = ({ show, onHi, onEditAlbum, postId }: EditAlbumModalProps) => {
  const [albumData, setAlbumData] = useState({
    title: '',
    isPublic: true,
    tags: [] as string[],
    coverUrl: '',
    imageUrl: '',
    scheduleAt: null as Date | null,
    caption : '',
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
            scheduleAt: album.post.schedule_at ? new Date(album.post.schedule_at) : null,
            caption : album.post.caption,
          });
          setSelectedTrackIds(album.post.content.songIds.map(track => track.songId));
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

  // Fetch all available tracks
  useEffect(() => {
    if (!show) return;

    const fetchTracks = async () => {
      try {
        setLoading(prev => ({ ...prev, tracks: true }));
        const response = await getTrack();
        if (response && Array.isArray(response.result)) {
          setAllTracks(response.result);
          setFilteredTracks(response.result);
        }
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setError('Failed to load tracks');
      } finally {
        setLoading(prev => ({ ...prev, tracks: false }));
      }
    };

    fetchTracks();
  }, [show]);

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

  const removeImage = (type: 'coverImage' | 'image') => {
    const urlKey = type === 'coverImage' ? 'coverUrl' : 'imageUrl';
    
    // Revoke preview URL if it exists
    if (preview[type]) {
      URL.revokeObjectURL(preview[type]);
    }
    
    setAlbumData(prev => ({ ...prev, [urlKey]: '' }));
    setPreview(prev => ({ ...prev, [type]: '' }));
    setPendingFiles(prev => ({ ...prev, [type]: null }));
  };

  const toggleTrackSelection = useCallback((trackId: string) => {
    setSelectedTrackIds(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setSelectedTrackIds(prev => prev.filter(id => id !== trackId));
  }, []);

  const handleSelectAll = useCallback(() => {
    const allFilteredTrackIds = filteredTracks.map(track => track.songId);
    setSelectedTrackIds(prev => 
      prev.length === allFilteredTrackIds.length
        ? [] // If all are selected, deselect all
        : Array.from(new Set([...prev, ...allFilteredTrackIds])) // Select all
    );
  }, [filteredTracks]);

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

  const handleScheduleChange = (date: Date | null) => {
    setAlbumData(prev => ({ ...prev, scheduleAt: date }));
  };

  const handleSubmit = async () => {
    if (!albumData.title.trim()) {
      setError('Please enter an album title');
      return;
    }
    if (selectedTrackIds.length === 0) {
      setError('Please select at least one track');
      return;
    }
    if (albumData.scheduleAt && albumData.scheduleAt < new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    // Check if any files are still uploading
    if (loading.uploadingCover || loading.uploadingImage) {
      setError('Please wait for file uploads to complete');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      await onEditAlbum({
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
      scheduleAt: null,
      caption : '',
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

  const allSelected = filteredTracks.length > 0 && 
    filteredTracks.every(track => selectedTrackIds.includes(track.songId));

  if (loading.initialLoad) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Album</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading album data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Album</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Album Title *</Form.Label>
            <Form.Control 
              type="text" 
              value={albumData.title}
              onChange={(e) => setAlbumData(prev => ({...prev, title: e.target.value}))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3"> 
          <Form.Label>Caption *</Form.Label>
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Schedule Release</Form.Label>
                <div className="d-flex align-items-center">
                  <FaCalendarAlt className="me-2" />
                  <DatePicker
                    selected={albumData.scheduleAt}
                    onChange={handleScheduleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    placeholderText="Select date and time"
                    className="form-control"
                  />
                </div>
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

          <Form.Group className="mb-4">
            <Form.Label>Select Tracks *</Form.Label>
            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search tracks..."
                  value={trackSearch}
                  onChange={(e) => setTrackSearch(e.target.value)}
                />
                {trackSearch && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setTrackSearch('')}
                  >
                    <FaTimes />
                  </Button>
                )}
              </div>
            </div>

            <div className="border rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {loading.tracks ? (
                <div className="text-center p-4">
                  <Spinner animation="border" />
                </div>
              ) : filteredTracks.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  {trackSearch ? 'No matching tracks' : 'No tracks available'}
                </div>
              ) : (
                <>
                  <div className="p-2 border-bottom bg-light">
                    <Form.Check
                      type="checkbox"
                      label="Select All"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <ListGroup variant="flush">
                    {filteredTracks.map(track => (
                      <ListGroup.Item key={track.songId} className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          checked={selectedTrackIds.includes(track.songId)}
                          onChange={() => toggleTrackSelection(track.songId)}
                          className="me-3"
                        />
                        <img 
                          src={track.imageUrl} 
                          alt={track.title}
                          width="40"
                          height="40"
                          className="rounded me-3"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{track.title}</div>
                        </div>
                        {selectedTrackIds.includes(track.songId) && (
                          <FaCheck className="text-success" />
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
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
            !albumData.title || 
            selectedTrackIds.length === 0
          }
        >
          {loading.submit ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            'Update Album'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAlbumModal;