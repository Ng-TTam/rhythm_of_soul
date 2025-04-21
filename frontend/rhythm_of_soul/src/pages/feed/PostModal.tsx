import React, { useState, useRef,useEffect } from 'react';
import { Card, Button, Form, Nav, Tab, Alert } from 'react-bootstrap';
import { FaMusic } from '@react-icons/all-files/fa/FaMusic';
import { BsShare } from 'react-icons/bs';
import { IoClose } from '@react-icons/all-files/io5/IoClose';


interface TrackItem {
  file: File;
  displayName: string;
  artist?: string;
}

interface PostModalProps {
  onClose: () => void;
  onPost: (postData: any) => void;
  currentUsername: string;
  currentUserAvatar: string;
}

const PostModal: React.FC<PostModalProps> = ({ onClose, onPost, currentUsername, currentUserAvatar }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [uploadType, setUploadType] = useState<'song' | 'playlist'>('song');
  const [trackItems, setTrackItems] = useState<TrackItem[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSharedItem, setSelectedSharedItem] = useState<any | null>(null);
  const [showFileLimitAlert, setShowFileLimitAlert] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [editingTrackIndex, setEditingTrackIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Chuyển sang chế độ playlist nếu chọn nhiều hơn 1 file
  useEffect(() => {
    if (trackItems.length > 1 && uploadType === 'song') {
      setUploadType('playlist');
      setShowFileLimitAlert(true);
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setShowFileLimitAlert(false);
      }, 3000);
    }
  }, [trackItems.length, uploadType]);
  
  // Giả lập tìm kiếm playlist/song
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // Mock data search results - trong ứng dụng thực tế, đây sẽ là API call
    if (term.length > 2) {
      const mockResults = [
        {
          id: 1,
          type: 'playlist',
          title: 'Summer Vibes',
          username: 'DJ Cool',
          imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
          trackCount: 12
        },
        {
          id: 2,
          type: 'song',
          title: 'Ocean Waves',
          username: 'Chill Master',
          imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
          duration: '3:45'
        },
        {
          id: 3,
          type: 'playlist',
          title: 'Workout Mix',
          username: currentUsername,
          imageUrl: 'https://i1.sndcdn.com/artworks-bEaCVtUyQtiSRt4G-K2gvog-t500x500.png',
          trackCount: 8
        }
      ].filter(item => 
        item.title.toLowerCase().includes(term.toLowerCase()) || 
        item.username.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Chuyển File[] thành TrackItem[]
      const newTrackItems = filesArray.map(file => ({
        file,
        displayName: file.name.replace(/\.[^/.]+$/, ""), // Loại bỏ phần mở rộng
        artist: currentUsername
      }));
      
      setTrackItems(prev => [...prev, ...newTrackItems]);
      
      if (filesArray.length > 1 && uploadType === 'song') {
        // Nếu đang ở chế độ song mà chọn nhiều file, tự động chuyển sang playlist
        setUploadType('playlist');
      }
    }
  };
  
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeTrack = (index: number) => {
    setTrackItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      // Nếu xóa file và còn 1 file, tự động chuyển về song nếu đang ở chế độ playlist
      if (newItems.length === 1 && uploadType === 'playlist') {
        setUploadType('song');
      }
      return newItems;
    });
  };
  
  const updateTrackInfo = (index: number, field: keyof TrackItem, value: string) => {
    setTrackItems(prev => {
      const newItems = [...prev];
      if (field === 'displayName') {
        newItems[index].displayName = value;
      } else if (field === 'artist') {
        newItems[index].artist = value;
      }
      return newItems;
    });
  };
  
  const moveTrack = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === trackItems.length - 1)) {
      return;
    }
    
    setTrackItems(prev => {
      const newItems = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };
  
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };
  
  const selectSharedItem = (item: any) => {
    setSelectedSharedItem(item);
    setSearchResults([]);
    setSearchTerm('');
  };
  
  const handlePost = () => {
    // Đơn giản hóa dữ liệu post theo yêu cầu
    const postData = activeTab === 'upload' 
      ? {
          type: 'upload',
          contentType: uploadType,
          title: uploadType === 'song' ? title : playlistName,
          content,
          tracks: trackItems,
          coverImage,
          timestamp: new Date().toISOString(),
          username: currentUsername,
          userAvatar: currentUserAvatar
        }
      : {
          type: 'share',
          content,
          sharedItem: selectedSharedItem,
          timestamp: new Date().toISOString(),
          username: currentUsername,
          userAvatar: currentUserAvatar
        };
    
    onPost(postData);
    onClose();
  };
  
  const isPostButtonDisabled = () => {
    if (activeTab === 'upload') {
      if (uploadType === 'song') {
        return !title || trackItems.length === 0;
      } else {
        return !playlistName || trackItems.length === 0;
      }
    } else {
      return !selectedSharedItem;
    }
  };
  
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
      <Card className="w-75 max-w-800">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Create Post</h5>
          <Button variant="link" className="text-white p-0" onClick={onClose}>
            <IoClose size={24} />
          </Button>
        </Card.Header>
        
        <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {showFileLimitAlert && (
            <Alert variant="info" onClose={() => setShowFileLimitAlert(false)} dismissible>
              Đã tự động chuyển sang chế độ playlist vì bạn đã chọn nhiều hơn 1 bài hát.
            </Alert>
          )}
          
          <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="upload" className="d-flex align-items-center">
                  <FaMusic className="me-2" /> Upload
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="share" className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"></path></svg> Share
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="upload">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Type</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        id="song-radio"
                        label="Song"
                        name="uploadType"
                        checked={uploadType === 'song'}
                        onChange={() => {
                          if (trackItems.length <= 1) {
                            setUploadType('song');
                          } else {
                            // Nếu nhiều hơn 1 file, không cho phép chuyển về song
                            alert('Vui lòng giảm xuống còn 1 bài hát để chuyển sang chế độ Song');
                          }
                        }}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        id="playlist-radio"
                        label="Playlist"
                        name="uploadType"
                        checked={uploadType === 'playlist'}
                        onChange={() => setUploadType('playlist')}
                      />
                    </div>
                  </Form.Group>
                  
                  {uploadType === 'song' ? (
                    <Form.Group className="mb-3">
                      <Form.Label>Tên bài hát</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Nhập tên bài hát" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Label>Tên playlist</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Nhập tên playlist" 
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
                    </Form.Group>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Cảm nghĩ về bài đăng</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Chia sẻ cảm nghĩ của bạn về bài hát/playlist này..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="mb-0">
                        {uploadType === 'song' ? 'Chọn bài hát' : 'Chọn các bài hát cho playlist'}
                      </Form.Label>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadType === 'song' ? 'Chọn file' : 'Chọn files'}
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="audio/*"
                      multiple={uploadType === 'playlist'}
                      style={{ display: 'none' }}
                    />
                    
                    {trackItems.length > 0 && (
                      <div className="selected-files mt-2">
                        <h6>Danh sách bài hát:</h6>
                        <ul className="list-group">
                          {trackItems.map((track, index) => (
                            <li 
                              key={index} 
                              className="list-group-item"
                            >
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                  {uploadType === 'playlist' && (
                                    <div className="me-2">
                                      <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        className="me-1"
                                        onClick={() => moveTrack(index, 'up')}
                                        disabled={index === 0}
                                      >
                                        ↑
                                      </Button>
                                      <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={() => moveTrack(index, 'down')}
                                        disabled={index === trackItems.length - 1}
                                      >
                                        ↓
                                      </Button>
                                    </div>
                                  )}
                                  <span className="me-2">{index + 1}.</span>
                                  {track.file.name}
                                </div>
                                <div>
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setEditingTrackIndex(editingTrackIndex === index ? null : index)}
                                  >
                                    {editingTrackIndex === index ? 'Đóng' : 'Sửa thông tin'}
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => removeTrack(index)}
                                  >
                                    <IoClose />
                                  </Button>
                                </div>
                              </div>
                              
                              {editingTrackIndex === index && (
                                <div className="track-edit-form">
                                  <Form.Group className="mb-2">
                                    <Form.Label>Tên hiển thị</Form.Label>
                                    <Form.Control 
                                      type="text" 
                                      value={track.displayName}
                                      onChange={(e) => updateTrackInfo(index, 'displayName', e.target.value)}
                                      size="sm"
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Nghệ sĩ</Form.Label>
                                    <Form.Control 
                                      type="text" 
                                      value={track.artist || ''}
                                      onChange={(e) => updateTrackInfo(index, 'artist', e.target.value)}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="mb-0">Ảnh bìa</Form.Label>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        Chọn ảnh
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleCoverImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    
                    {coverImagePreview && (
                      <div className="position-relative d-inline-block">
                        <img 
                          src={coverImagePreview} 
                          alt="Cover preview" 
                          className="img-thumbnail" 
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="position-absolute top-0 end-0" 
                          onClick={removeCoverImage}
                        >
                          <IoClose />
                        </Button>
                      </div>
                    )}
                  </Form.Group>
                </Form>
              </Tab.Pane>
              
              <Tab.Pane eventKey="share">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tìm kiếm bài hát hoặc playlist</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Tìm theo tên bài hát hoặc nghệ sĩ" 
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </Form.Group>
                  
                  {searchResults.length > 0 && (
                    <div className="search-results mb-3">
                      <h6>Kết quả tìm kiếm:</h6>
                      <div className="list-group">
                        {searchResults.map(item => (
                          <div 
                            key={item.id} 
                            className="list-group-item list-group-item-action d-flex align-items-center cursor-pointer"
                            onClick={() => selectSharedItem(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="me-3" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-secondary me-2">
                                  {item.type === 'playlist' ? 'Playlist' : 'Track'}
                                </span>
                                <h6 className="mb-0">{item.title}</h6>
                              </div>
                              <small>{item.username}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedSharedItem && (
                    <div className="selected-item mb-3">
                      <h6>Item đã chọn:</h6>
                      <Card className="bg-light">
                        <Card.Body className="d-flex">
                          <img 
                            src={selectedSharedItem.imageUrl} 
                            alt={selectedSharedItem.title} 
                            className="me-3" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-secondary me-2">
                                {selectedSharedItem.type === 'playlist' ? 'Playlist' : 'Track'}
                              </span>
                              <h5 className="mb-0">{selectedSharedItem.title}</h5>
                            </div>
                            <p className="mb-1">by {selectedSharedItem.username}</p>
                            <p className="mb-0">
                              {selectedSharedItem.type === 'playlist' 
                                ? `${selectedSharedItem.trackCount} tracks` 
                                : `Duration: ${selectedSharedItem.duration}`}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Cảm nghĩ về bài chia sẻ</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Chia sẻ cảm nghĩ của bạn về bài hát/playlist này..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
        
        <Card.Footer className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePost}
            disabled={isPostButtonDisabled()}
          >
            Đăng
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default PostModal;