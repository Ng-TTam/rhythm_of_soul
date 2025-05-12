import { useState, useEffect } from 'react';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill';
import { BsHeart } from '@react-icons/all-files/bs/BsHeart';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { BsChat } from '@react-icons/all-files/bs/BsChat';

import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';

import { useNavigate } from 'react-router-dom';

export default function SongDisplay() {
  interface Song {
    id: string | number;
    content: {
      imageUrl: string;
      title: string;
      tags: string[];
      coverUrl?: string;
      mediaUrl?: string;
    };
    caption?: string;
    _public: boolean;
    like_count?: number;
    comment_count?: number;
    view_count?: number;
    created_at: string;
  }

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | number | null>(null);
  const [likedSongs, setLikedSongs] = useState<Record<string | number, boolean>>({});
  
  // Get userId from URL params or use default
  const userId = "1234"; // In a real app, this might come from context or route params
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8484/posts/${userId}/songs`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        setSongs(data.result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSongs();
  }, [userId]);
  
  const togglePlay = (songId: string | number) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
    }
  };
  const handleSongDetail = (songId: string | number) => {
    navigate(`/songs/${songId}`);
  }
  const toggleLike = (songId: string | number) => {
    setLikedSongs(prev => ({
      ...prev,
      [songId]: !prev[songId]
    }));
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Music Collection</h2>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {songs.map((song) => (
          <div key={song.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="position-relative" onClick={() => handleSongDetail(song.id)}>
                <img 
                  src={song.content.imageUrl} 
                  alt={song.content.title} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div 
                  className="position-absolute top-0 end-0 m-2 p-1 bg-dark bg-opacity-50 rounded-circle"
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePlay(song.id)}
                >
                  {currentlyPlaying === song.id ? 
                    <BsPauseFill size={30} color="white" /> : 
                    <BsPlayFill size={30} color="white" />
                  }
                </div>
                
                <div className="position-absolute bottom-0 start-0 m-2 p-1">
                  {song._public ? 
                    <MdPublic size={20} color="white" className="me-1" /> : 
                    <MdPublic size={20} color="white" className="me-1" />
                  }
                </div>
              </div>
              
              <div className="card-body">
                <h5 className="card-title">{song.content.title}</h5>
                {song.caption && <p className="card-text text-muted">{song.caption}</p>}
                
                <div className="d-flex mt-2">
                  {song.content.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-secondary me-1">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="card-footer bg-white border-top-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-sm"
                      onClick={() => toggleLike(song.id)}
                    >
                      {likedSongs[song.id] ? 
                        <BsHeartFill className="text-danger" size={18} /> : 
                        <BsHeart size={18} />
                      }
                      <span className="ms-1">{(song.like_count || 0) + (likedSongs[song.id] ? 1 : 0)}</span>
                    </button>
                    
                    <button className="btn btn-sm">
                      <BsChat size={18} />
                      <span className="ms-1">{song.comment_count || 0}</span>
                    </button>
                    
                    <button className="btn btn-sm">
                      <BsEyeFill size={18} />
                      <span className="ms-1">{song.view_count || 0}</span>
                    </button>
                  </div>
                  
                  <div>
                    <button className="btn btn-sm">
                      <BsThreeDots size={20} />
                    </button>
                  </div>
                </div>
                
                <small className="text-muted">
                  {new Date(song.created_at).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {songs.length === 0 && (
        <div className="text-center my-5">
          <p className="text-muted">No songs found.</p>
        </div>
      )}
    </div>
  );
}