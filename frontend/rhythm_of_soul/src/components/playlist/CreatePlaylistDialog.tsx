import React, { useState, ChangeEvent, FormEvent } from 'react';

interface NewPlaylistForm {
  title: string;
  description: string;
}

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (playlist: { title: string; description: string }) => void;
}

const CreatePlaylistDialog: React.FC<CreatePlaylistDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreatePlaylist 
}) => {
  const [formData, setFormData] = useState<NewPlaylistForm>({
    title: '',
    description: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!formData.title) return;
    
    onCreatePlaylist(formData);
    setFormData({ title: '', description: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div className="modal-content" 
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <h3 className="mb-4">Tạo playlist mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="playlistTitle" className="form-label">Tên playlist</label>
            <input 
              type="text" 
              className="form-control" 
              id="playlistTitle"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tên playlist"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="playlistDescription" className="form-label">Mô tả</label>
            <textarea 
              className="form-control" 
              id="playlistDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả playlist (tùy chọn)"
              rows={3}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2"
              onClick={onClose}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Tạo playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistDialog;