import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import {addSongToPlaylist,getBasicPlaylist } from '../../services/postService';
interface AddToPlaylistModalProps {
  songId: string;
  onClose: () => void;
  onAddSuccess: () => void;
}
export interface Playlist {
  id : string;
  name: string;
}
const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ 
  songId, 
  onClose, 
  onAddSuccess 
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([{
    id: '',
    name: '',
  }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response= await getBasicPlaylist(songId);
        if (response.code !== 200) throw new Error(response.message);
        setPlaylists(response.result.map((playlist: any) => ({

          id: playlist.id,
          name: playlist.name || 'Unnamed Playlist',
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return;
    setIsAdding(true);
    try {
      
      const response = await addSongToPlaylist(selectedPlaylist, songId);
      if (response.code !== 200) throw new Error(response.message);
      
      onAddSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thêm bài hát vào playlist');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm vào playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : playlists.length === 0 ? (
          <p className="text-muted">Bạn chưa có playlist nào</p>
        ) : (
          <ListGroup>
            {playlists.map(playlist => (
              <ListGroup.Item 
                key={playlist.id}
                action
                active={selectedPlaylist === playlist.id}
                onClick={() => setSelectedPlaylist(playlist.id)}
                className="d-flex justify-content-between align-items-center"
              >
                {playlist.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isAdding}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={handleAddToPlaylist}
          disabled={!selectedPlaylist || isAdding}
        >
          {isAdding ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Đang thêm...
            </>
          ) : 'Thêm vào playlist'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToPlaylistModal;