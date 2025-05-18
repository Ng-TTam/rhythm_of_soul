import React, { useState, useRef } from 'react';
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import {AddPlaylistModalProps} from '../../model/post/Playlist';
const MUSIC_TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP-HOP', 'ELECTRONIC'];

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({
  show,
  onHide,
  currentUser,
  onCreate,
  isCreating,
  error
}) => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({
      title,
      isPublic,
      cover: coverImage || undefined,
      image: image || undefined,
      tags: selectedTags
    });
    // Reset form only if creation was successful
    if (!error) {
      setTitle('');
      setIsPublic(true);
      setCoverImage(null);
      setImage(null);
      setCoverImage(null);
      setPreviewImage(null);
      setSelectedTags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Tạo Playlist Mới</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Playlist</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên playlist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Thể loại</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {MUSIC_TAGS.map(tag => (
                    <Form.Check
                      key={tag}
                      type="checkbox"
                      id={`tag-${tag}`}
                      label={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      inline
                      className="tag-checkbox"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="public-switch"
                  label="Công khai"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ảnh bìa</Form.Label>
                <div className="border rounded p-3 text-center">
                  {previewCover ? (
                    <img 
                      src={previewCover} 
                      alt="Preview" 
                      className="img-fluid mb-2" 
                      style={{ maxHeight: '200px' }}
                    />
                  ) : (
                    <div className="py-5 bg-light mb-2">
                      <i className="bi bi-image fs-1 text-muted"></i>
                      <p className="text-muted">Chưa có ảnh bìa</p>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    ref={fileInputRef}
                  />
                  <Form.Text className="text-muted">
                    Tải lên ảnh bìa cho playlist 
                  </Form.Text>
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện</Form.Label>
                <div className="border rounded p-3 text-center">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="img-fluid mb-2" 
                      style={{ maxHeight: '200px' }}
                    />
                  ) : (
                    <div className="py-5 bg-light mb-2">
                      <i className="bi bi-image fs-1 text-muted"></i>
                      <p className="text-muted">Chưa có ảnh </p>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <Form.Text className="text-muted">
                    Tải lên ảnh cho playlist 
                  </Form.Text>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isCreating}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Đang tạo...</span>
              </>
            ) : 'Tạo Playlist'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPlaylistModal;
