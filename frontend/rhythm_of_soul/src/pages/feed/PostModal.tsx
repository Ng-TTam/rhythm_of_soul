import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { PostModalProps } from '../../model/post';
import axios from 'axios';

const PostModal: React.FC<PostModalProps> = ({
  onClose,
  onPost,
  currentUsername,
  currentUserAvatar,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState('TEXT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const visibilityOptions = ['Public', 'Private'];
  const tagOptions = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP-HOP', 'ELECTRONIC'];
  
  const [formData, setFormData] = useState<{
    caption: string;
    title: string;
    user_id: string;
    type: string;
    tag: string[];
    song: File | null;
    image: File | null;
    cover: File | null;
    isPublic: boolean;
  }>({
    caption: '',
    title: '',
    user_id: currentUserId || '',
    type: activeTab,
    tag: [],
    song: null,
    image: null,
    cover: null,
    isPublic: true,
  });

  const handleVisibilityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      isPublic: value === 'Public'
    }));
  }, []);
  
  const handleTagToggle = useCallback((tag: string) => {
    setFormData(prev => {
      const updatedTags = prev.tag.includes(tag) 
        ? prev.tag.filter(t => t !== tag) 
        : [...prev.tag, tag];
        
      return {
        ...prev,
        tag: updatedTags
      };
    });
  }, []);

  const handleFileChange = useCallback((fieldName: 'song' | 'image' | 'cover', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Cập nhật type trong formData theo activeTab hiện tại
      const updatedFormData = {
        ...formData,
        type: activeTab,
        user_id: currentUserId
      };
      
      // Kiểm tra các trường bắt buộc khi là tab SONG
      if (activeTab === 'SONG') {
        if (!formData.song) {
          setErrorMessage('Please select a song file');
          setIsSubmitting(false);
          return;
        }
        if (!formData.title) {
          setErrorMessage('Please enter a title');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Kiểm tra ít nhất phải có caption trong tab TEXT
      if (activeTab === 'TEXT' && !formData.caption.trim()) {
        setErrorMessage('Please enter some text for your post');
        setIsSubmitting(false);
        return;
      }
      
      // Xử lý khác nhau cho từng loại post
      if (activeTab === 'TEXT') {
        console.log('Posting text:', updatedFormData);
        
        try {
          // Tạo dữ liệu để gửi đi trong body của request
          const textPostData = {
            caption: updatedFormData.caption,
            user_id: updatedFormData.user_id,
            type: updatedFormData.type,
            isPublic: updatedFormData.isPublic,
            content : null
          };
          console.log('Text post data:', textPostData);
          // Gọi API để đăng TEXT post - truyền dữ liệu trong body
          const response = await axios.post(
            'http://localhost:8484/posts', 
            textPostData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Text post response:', response.data);
          
          // Gọi callback onPost để thông báo cho component cha
          onPost(response.data.result);
          onClose();
        } catch (error) {
          console.error('Error posting text:', error);
          const err = error as any;
          setErrorMessage(err.response?.data?.message || 'Error posting text. Please try again.');
        }
      } else if (activeTab === 'SONG') {
        // Tạo FormData để gửi multipart/form-data
        const formDataToSend = new FormData();
        
        // Thêm các file
        if (formData.song) formDataToSend.append('song', formData.song);
        if (formData.image) formDataToSend.append('image', formData.image);
        if (formData.cover) formDataToSend.append('cover', formData.cover);
        formDataToSend.append('isPublic', formData.isPublic.toString());
        
        // Thêm các trường thông tin
        formDataToSend.append('user_id', currentUserId);
        if (formData.title) formDataToSend.append('title', formData.title);
        
        // Thêm caption vào form data nếu có
        if (formData.caption) {
          formDataToSend.append('caption', formData.caption);
        } 
        
        // Xử lý tags - cần thêm từng tag vào form data
        formData.tag.forEach(tag => {
          formDataToSend.append('tags', tag);
        });
        
        // Thêm type
        formDataToSend.append('type', activeTab);
        
        // Gọi API upload
        const response = await axios.post(
          'http://localhost:8484/posts/upload', 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log('Upload response:', response.data);
        
        // Gọi callback onPost để thông báo cho component cha
        onPost(response.data.result);
        
        // Đóng modal
        onClose();
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      const err = error as any;
      setErrorMessage(err.response?.data?.message || 'Error submitting post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, activeTab, onPost, currentUserId, onClose]);

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          
          <div className="d-flex mb-3">
            <img
              src={currentUserAvatar}
              alt={currentUsername}
              style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 15 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.jpg';
              }}
            />
            <div>
              <h6>{currentUsername}</h6>
              <select
                className="form-select form-select-sm"
                style={{ width: 150 }}
                onChange={handleVisibilityChange}
                value={formData.isPublic ? 'Public' : 'Private'}
              >
                {visibilityOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k || 'TEXT');
              // Cần cập nhật type trong formData khi chuyển tab
              setFormData(prev => ({
                ...prev,
                type: k || 'TEXT'
              }));
            }}
            className="mb-3"
          >
            <Tab eventKey="TEXT" title="Text">
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  name="caption"
                  rows={3}
                  placeholder="What's on your mind?"
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    caption: e.target.value
                  }))}
                />
              </Form.Group>
            </Tab>

            <Tab eventKey="SONG" title="Song">
              <Form.Group className="mb-3">
                <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                {/* Fix for title input - use an actual input element with required attribute */}
                <input 
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Enter song title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  required={activeTab === 'SONG'}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Caption</Form.Label>
                <Form.Control
                  as="textarea"
                  name="caption"
                  rows={2}
                  placeholder="Add a caption..."
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    caption: e.target.value
                  }))}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                
                {/* Checkbox-based tag selection */}
                <div className="border rounded p-2">
                  <div className="row g-2">
                    {tagOptions.map((tag, index) => (
                      <div key={index} className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name={`tag-${tag}`}
                            id={`tag-${tag}`}
                            checked={formData.tag.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                          />
                          <label className="form-check-label" htmlFor={`tag-${tag}`}>
                            {tag}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Display selected tags as badges */}
                {formData.tag.length > 0 && (
                  <div className="mt-2">
                    <div className="d-flex flex-wrap gap-2">
                      {formData.tag.map((tag, index) => (
                        <span key={index} className="badge bg-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Song <span className="text-danger">*</span></Form.Label>
                {/* Fix for song input - use an actual input element with required attribute */}
                <input
                  type="file"
                  className="form-control"
                  name="song"
                  accept="audio/*"
                  onChange={(e) => handleFileChange('song', e as React.ChangeEvent<HTMLInputElement>)}
                  required={activeTab === 'SONG'}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleFileChange('image', e as React.ChangeEvent<HTMLInputElement>)}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Cover</Form.Label>
                <Form.Control
                  type="file"
                  name="cover"
                  accept="image/*"
                  onChange={(e) => handleFileChange('cover', e as React.ChangeEvent<HTMLInputElement>)}
                />
              </Form.Group>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PostModal;