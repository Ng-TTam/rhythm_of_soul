import { useState } from 'react';
import Swal from 'sweetalert2';

interface SongEditForm {
  title: string;
  caption: string;
  tags: string[];
}

interface EditSongModalProps {
  songId: string | number;
  initialData: {
    title: string;
    caption?: string;
    tags: string[];
  };
  onClose: () => void;
  onSave: (updatedData: SongEditForm) => Promise<void>;
}

const TAGS = ['ROCK', 'POP', 'JAZZ', 'CLASSICAL', 'HIP_HOP', 'ELECTRONIC'];

export default function EditSongModal({ 
  songId, 
  initialData, 
  onClose, 
  onSave 
}: EditSongModalProps) {
  const [formData, setFormData] = useState<SongEditForm>({
    title: initialData.title,
    caption: initialData.caption || '',
    tags: initialData.tags || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTagChange = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSave(formData);
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