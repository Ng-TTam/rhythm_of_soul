import React, { useState } from 'react';
// Import React Icons
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { FiMusic } from '@react-icons/all-files/fi/FiMusic';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { FiCalendar } from '@react-icons/all-files/fi/FiCalendar';
import { FiDisc } from '@react-icons/all-files/fi/FiDisc';
import { FiUpload } from '@react-icons/all-files/fi/FiUpload';
import { FiCheck } from '@react-icons/all-files/fi/FiCheck';


interface NewAlbumForm {
  title: string; 
  artist: string;
  coverImage: string;
  genre: string;
  releaseYear: number;
  tracks: number;
}
  
interface CreateAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlbum: (album: NewAlbumForm) => void;
}

const AddAlbumForm: React.FC<CreateAlbumDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateAlbum 
}) => {
  const initialFormState: NewAlbumForm = {
    title: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
    genre: 'Pop',
    tracks: 1,
    coverImage: '/api/placeholder/400/400'
  };

  const [formData, setFormData] = useState<NewAlbumForm>(initialFormState);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('/api/placeholder/400/400');

  const genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Country', 'Jazz', 'Classical', 'Alternative'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'releaseYear' || name === 'tracks' ? parseInt(value, 10) : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setPreviewUrl(e.target.result);
        }
        setFormData({
          ...formData,
          coverImage: file.name // Store filename for display purposes
        });
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call the onCreateAlbum prop with the form data
    onCreateAlbum(formData);
    
    // Show success message
    setSuccessMessage(`Album "${formData.title}" by ${formData.artist} has been added!`);
    
    // Reset form and preview
    setFormData(initialFormState);
    setSelectedFile(null);
    setPreviewUrl('/api/placeholder/400/400');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // If the form is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className=" py-4 modal-overlay"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}
    >
      
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <FiCheck className="me-2" size={18} />
          <div>{successMessage}</div>
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="card border-0 shadow-sm mb-4"
      style={{
        width: '90%',
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '10px',
        backgroundColor: '#fff',
        zIndex: 1001,
      }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <FiDisc className="text-primary me-2" size={24} />
            <h3 className="card-title h4 mb-0">Add New Album</h3>
          </div>
          
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Album Title</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FiMusic />
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter album title"
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Artist</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FiUser />
                </span>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter artist name"
                />
              </div>
            </div>
          </div>
          
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Release Year</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FiCalendar />
                </span>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="form-select"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Number of Tracks</label>
              <input
                type="number"
                name="tracks"
                value={formData.tracks}
                onChange={handleChange}
                min="1"
                className="form-control"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="mb-3">Album Cover</h5>
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="upload-area border border-2 border-dashed rounded p-4 text-center">
                  <FiUpload className="d-block mx-auto text-muted mb-3" size={32} />
                  <div className="mb-2">
                    <label htmlFor="file-upload" className="btn btn-sm btn-outline-primary me-2">
                      Choose File
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="text-muted">or drag and drop</span>
                  </div>
                  <small className="text-muted d-block">PNG, JPG, GIF up to 10MB</small>
                  {selectedFile && (
                    <div className="mt-2 text-success">
                      <small>Selected: {selectedFile.name}</small>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="d-flex justify-content-center">
                  <div className="cover-preview rounded border" style={{width: '140px', height: '140px', overflow: 'hidden'}}>
                    <img 
                      src={previewUrl} 
                      alt="Album cover preview" 
                      className="img-fluid w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button 
              type="button"
              onClick={() => {
                setFormData(initialFormState);
                setSelectedFile(null);
                setPreviewUrl('/api/placeholder/400/400');
                onClose();
              }}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="btn btn-success d-flex align-items-center"
            >
              <FiPlus className="me-1" /> Add Album
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAlbumForm;