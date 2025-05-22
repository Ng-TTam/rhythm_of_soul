import { useState, useRef, ChangeEvent } from 'react';
import Swal from 'sweetalert2';
import { uploadFile } from '../../services/postService';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';
import { MdLock } from '@react-icons/all-files/md/MdLock';

interface SongEditForm {
  title: string;
  caption: string;
  tags: string[];
  imageUrl: string;
  coverUrl: string;
  isPublic: boolean;
}

interface EditSongModalProps {
  songId: string | number;
  initialData: {
    title: string;
    caption?: string;
    tags: string[];
    imageUrl?: string;
    coverUrl?: string;
    isPublic?: boolean;
  };
  onClose: () => void;
  onSave: (updatedData: SongEditForm) => Promise<void>;
}

const TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP_HOP', 'ELECTRONIC'];

export default function EditSongModal({ 
  songId, 
  initialData, 
  onClose, 
  onSave,
}: EditSongModalProps) {
  const [formData, setFormData] = useState<SongEditForm>({
    title: initialData.title,
    caption: initialData.caption || '',
    tags: initialData.tags || [],
    imageUrl: initialData.imageUrl || '',
    coverUrl: initialData.coverUrl || '',
    isPublic: initialData.isPublic ?? true, // Default to true if not provided
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const togglePrivacy = () => {
    setFormData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageInput = () => {
    imageInputRef.current?.click();
  };

  const triggerCoverInput = () => {
    coverInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updatedData = { ...formData };
      
      if (coverFile) {
        const coverUrl = await uploadFile({
          file: coverFile, 
          type: 'cover'
        });
        updatedData.coverUrl = coverUrl.result;
      }
      
      if (imageFile) {
        const imageUrl = await uploadFile({
          file: imageFile, 
          type: 'image'
        });
        updatedData.imageUrl = imageUrl.result;
      }
      
      await onSave(updatedData);
      
      await Swal.fire(
        'Thành công!',
        'Bài hát đã được cập nhật.',
        'success'
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update song');
      await Swal.fire(
        'Lỗi!',
        'Cập nhật bài hát thất bại.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa bài hát</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="songTitle" className="form-label">Tiêu đề</label>
                <input
                  type="text"
                  id="songTitle"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="songCaption" className="form-label">Mô tả</label>
                <textarea
                  id="songCaption"
                  className="form-control"
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  disabled={loading}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label d-flex justify-content-between align-items-center">
                  <span>Quyền riêng tư</span>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.isPublic ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                    onClick={togglePrivacy}
                    disabled={loading}
                  >
                    {formData.isPublic ? (
                      <>
                        <MdPublic className="me-1" />
                        Công khai
                      </>
                    ) : (
                      <>
                        <MdLock className="me-1" />
                        Riêng tư
                      </>
                    )}
                  </button>
                </label>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Ảnh bài hát</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <img 
                      src={imagePreview || formData.imageUrl || 'https://via.placeholder.com/150'} 
                      alt="Song preview" 
                      className="img-thumbnail" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-1"
                      onClick={triggerImageInput}
                      disabled={loading}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="d-none"
                  />
                  {!imagePreview && !formData.imageUrl && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={triggerImageInput}
                      disabled={loading}
                    >
                      Chọn ảnh
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Ảnh bìa</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <img 
                      src={coverPreview || formData.coverUrl || 'https://via.placeholder.com/150'} 
                      alt="Cover preview" 
                      className="img-thumbnail" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-1"
                      onClick={triggerCoverInput}
                      disabled={loading}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverChange}
                    accept="image/*"
                    className="d-none"
                  />
                  {!coverPreview && !formData.coverUrl && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={triggerCoverInput}
                      disabled={loading}
                    >
                      Chọn ảnh
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Thể loại</label>
                <div className="d-flex flex-wrap gap-3">
                  {TAGS.map(tag => (
                    <div key={tag} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`tag-${tag}`}
                        checked={formData.tags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor={`tag-${tag}`}>
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}