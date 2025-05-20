import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { AssignArtistRequest } from '../../model/profile/AssignArtistRequest';
import { assignArtist } from '../../services/api/userService';
import { FaUser } from '@react-icons/all-files/fa/FaUser';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';

interface ArtistRegisterModalProps {
  show: boolean;
  onHide: () => void;
}

const ArtistRegisterModal: React.FC<ArtistRegisterModalProps> = ({ show, onHide }) => {
  const [formData, setFormData] = useState<AssignArtistRequest>({
    stageName: '',
    bio: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
  });

 const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error khi người dùng gõ
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.stageName.trim()) newErrors.stageName = 'Stage name is required.';
    if (!formData.bio.trim()) newErrors.bio = 'Biography is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await assignArtist(formData);
      setSuccess(true);
      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (err) {
      setError('Unable to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký nghệ sĩ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Đăng ký thành công!</Alert>}

        <Form>
          <Form.Group controlId="stageName">
            
            <Form.Label className="d-flex align-items-center gap-2"><FaUser />Stage name</Form.Label>
            <Form.Control
              type="text"
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              isInvalid={!!errors.stageName}
              placeholder="Enter your stage name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.stageName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="bio" className="mt-3">
            <Form.Label className="d-flex align-items-center gap-2"><FaInfoCircle />Biography</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              isInvalid={!!errors.bio}
              placeholder="Personal biography"
            />
            <Form.Control.Feedback type="invalid">
              {errors.bio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="facebookUrl" className="mt-3">
            <Form.Label className="d-flex align-items-center gap-2"><FaFacebook/>Facebook</Form.Label>
            <Form.Control
              type="url"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />
          </Form.Group>

          <Form.Group controlId="instagramUrl" className="mt-3">
            <Form.Label className="d-flex align-items-center gap-2"><FaInstagram/>Instagram</Form.Label>
            <Form.Control
              type="url"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />
          </Form.Group>

          <Form.Group controlId="youtubeUrl" className="mt-3">
            <Form.Label className="d-flex align-items-center gap-2"><FaYoutube/>YouTube</Form.Label>
            <Form.Control
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArtistRegisterModal;
