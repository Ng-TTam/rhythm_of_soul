import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Spinner, Alert, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaCheck } from '@react-icons/all-files/fa/FaCheck';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Track, AddAlbumModalProps} from '../../model/post/Album';
import { FaTimesCircle } from '@react-icons/all-files/fa/FaTimesCircle';
import { getTrack } from '../../services/postService';

const GENRE_TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP-HOP', 'ELECTRONIC'];

const AddAlbumModal = ({ show, onHide, onAddAlbum }: AddAlbumModalProps) => {
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    isPublic: true,
    tags: [] as string[],
    coverImage: null as File | null,
    image: null as File | null,
    scheduleAt: null as Date | null,
  });

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [trackSearch, setTrackSearch] = useState('');
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [preview, setPreview] = useState({
    coverImage: '',
    image: ''
  });
  const [loading, setLoading] = useState({
    tracks: false,
    submit: false
  });
  const [error, setError] = useState('');

  // Fetch tracks when modal opens
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

  // Handle file upload preview
  useEffect(() => {
    if (!newAlbum.coverImage) {
      setPreview(prev => ({ ...prev, coverImage: '' }));
      return;
    }
    const objectUrl = URL.createObjectURL(newAlbum.coverImage);
    setPreview(prev => ({ ...prev, coverImage: objectUrl }));
    return () => URL.revokeObjectURL(objectUrl);
  }, [newAlbum.coverImage]);

  useEffect(() => {
    if (!newAlbum.image) {
      setPreview(prev => ({ ...prev, image: '' }));
      return;
    }
    const objectUrl = URL.createObjectURL(newAlbum.image);
    setPreview(prev => ({ ...prev, image: objectUrl }));
    return () => URL.revokeObjectURL(objectUrl);
  }, [newAlbum.image]);

  const handleFileChange = (e: React.ChangeEvent<any>, type: 'coverImage' | 'image') => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setNewAlbum(prev => ({ ...prev, [type]: file }));
    setError('');
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
    setNewAlbum(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setNewAlbum(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  const handleScheduleChange = (date: Date | null) => {
    setNewAlbum(prev => ({ ...prev, scheduleAt: date }));
  };

  const handleSubmit = async () => {
    if (!newAlbum.title.trim()) {
      setError('Please enter an album title');
      return;
    }
    if (!newAlbum.coverImage || !newAlbum.image) {
      setError('Please upload both cover and main images');
      return;
    }
    if (selectedTrackIds.length === 0) {
      setError('Please select at least one track');
      return;
    }
    if (newAlbum.scheduleAt && newAlbum.scheduleAt < new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      await onAddAlbum({
        ...newAlbum,
        tracks: selectedTrackIds
      });
      handleHide();
    } catch (err) {
      console.error("Error creating album:", err);
      setError('Failed to create album. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleHide = () => {
    setNewAlbum({
      title: '',
      isPublic: true,
      tags: [],
      coverImage: null,
      image: null,
      scheduleAt: null
    });
    setSelectedTrackIds([]);
    setTrackSearch('');
    setPreview({ coverImage: '', image: '' });
    setError('');
    onHide();
  };

  const getSelectedTracks = () => {
    return allTracks.filter(track => selectedTrackIds.includes(track.songId));
  };

  const allSelected = filteredTracks.length > 0 && 
    filteredTracks.every(track => selectedTrackIds.includes(track.songId));

  return (
    <Modal show={show} onHide={handleHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create New Album</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Album Title *</Form.Label>
            <Form.Control 
              type="text" 
              value={newAlbum.title}
              onChange={(e) => setNewAlbum(prev => ({...prev, title: e.target.value}))}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Cover Image *</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverImage')}
                  required
                />
                {preview.coverImage && (
                  <div className="mt-2 text-center">
                    <img 
                      src={preview.coverImage} 
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
                <Form.Label>Main Image *</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  required
                />
                {preview.image && (
                  <div className="mt-2 text-center">
                    <img 
                      src={preview.image} 
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
                        variant={newAlbum.tags.includes(tag) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className="text-uppercase"
                      >
                        {tag}
                        {newAlbum.tags.includes(tag) && <FaCheck className="ms-2" />}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {newAlbum.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {newAlbum.tags.map(tag => (
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
                    selected={newAlbum.scheduleAt}
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
                checked={newAlbum.isPublic}
                onChange={() => setNewAlbum(prev => ({...prev, isPublic: true}))}
              />
              <Form.Check
                inline
                type="radio"
                label="Private"
                checked={!newAlbum.isPublic}
                onChange={() => setNewAlbum(prev => ({...prev, isPublic: false}))}
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
        <Button variant="outline-secondary" onClick={handleHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={
            loading.submit || 
            !newAlbum.title || 
            !newAlbum.coverImage || 
            !newAlbum.image || 
            selectedTrackIds.length === 0
          }
        >
          {loading.submit ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creating...
            </>
          ) : (
            'Create Album'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAlbumModal;