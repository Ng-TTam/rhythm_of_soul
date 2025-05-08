import React, { useState } from 'react';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { BsFillPlayFill} from '@react-icons/all-files/bs/BsFillPlayFill';
import {BsHeart} from '@react-icons/all-files/bs/BsHeart';
import { BsHeartFill } from '@react-icons/all-files/bs/BsHeartFill';
import { HiOutlineClock } from '@react-icons/all-files/hi/HiOutlineClock';
import { IoMdDownload } from '@react-icons/all-files/io/IoMdDownload';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  liked: boolean;
  thumbnail: string;
  views: string;
}

interface AlbumProps {
  title: string;
  artist: string;
  releaseYear: number;
  coverImage: string;
  description: string;
  genre: string;
  label: string;
  songs: Song[];
}
const AlbumPage: React.FC = () => {
  const [album, setAlbum] = useState<AlbumProps>({
    title: "Midnights",
    artist: "Taylor Swift",
    releaseYear: 2022,
    coverImage: "/assets/images/dashboard/01.png",
    description: "Midnights is the tenth studio album by American singer-songwriter Taylor Swift, released on October 21, 2022. Inspired by 'sleepless nights' throughout Swift's life, Midnights is a concept album about nocturnal ruminations. The album explores themes of self-criticism, insecurities, anxiety, and self-confidence.",
    genre: "Pop, Synth-pop, Alternative",
    label: "Republic Records",
    songs: [
      { id: '01', title: "Lavender Haze", artist: "Taylor Swift", duration: "3:22", liked: false, thumbnail: "/assets/images/plugins/01.jpg", views: "124M" },
      { id: '02', title: "Maroon", artist: "Taylor Swift", duration: "3:38", liked: true, thumbnail: "/assets/images/plugins/img1.jpg", views: "89M" },
      { id: '03', title: "Anti-Hero", artist: "Taylor Swift", duration: "3:20", liked: false, thumbnail: "/assets/images/plugins/img2.jpg", views: "156M" },
      { id: '04', title: "Snow On The Beach", artist: "Taylor Swift, Lana Del Rey", duration: "4:16", liked: false, thumbnail: "/assets/images/plugins/img3.jpg", views: "78M" },
      { id: '05', title: "You're On Your Own, Kid", artist: "Taylor Swift", duration: "3:14", liked: true, thumbnail: "/assets/images/plugins/img4.jpg", views: "92M" },
      { id: '06', title: "Midnight Rain", artist: "Taylor Swift", duration: "2:55", liked: false, thumbnail: "/assets/images/plugins/img5.jpg", views: "83M" },
      { id: '07', title: "Question...?", artist: "Taylor Swift", duration: "3:30", liked: false, thumbnail: "/assets/images/plugins/img6.jpg", views: "67M" },
      { id: '08', title: "Vigilante Shit", artist: "Taylor Swift", duration: "2:45", liked: true, thumbnail: "/assets/images/plugins/img7.jpg", views: "104M" },
      { id: '09', title: "Bejeweled", artist: "Taylor Swift", duration: "3:14", liked: false, thumbnail: "/assets/images/plugins/img8.jpg", views: "95M" },
      { id: '10', title: "Labyrinth", artist: "Taylor Swift", duration: "4:08", liked: false, thumbnail: "/assets/images/plugins/img9.jpg", views: "64M" },
      { id: '11', title: "Karma", artist: "Taylor Swift", duration: "3:25", liked: true, thumbnail: "/assets/images/plugins/img10.jpg", views: "118M" },
      { id: '12', title: "Sweet Nothing", artist: "Taylor Swift", duration: "3:09", liked: false, thumbnail: "/assets/images/plugins/img11.jpg", views: "76M" },
      { id: '13', title: "Mastermind", artist: "Taylor Swift", duration: "3:11", liked: false, thumbnail: "/assets/images/plugins/img12.jpg", views: "88M" },
    ]
  });

  const handleLikeToggle = (id: string) => {
    setAlbum(prevAlbum => ({
      ...prevAlbum,
      songs: prevAlbum.songs.map(song => 
        song.id === id ? { ...song, liked: !song.liked } : song
      )
    }));
  };

  // Calculate total duration
  const totalDuration = (): string => {
    const totalMinutes = album.songs.reduce((total, song) => {
      const [minutes, seconds] = song.duration.split(':').map(Number);
      return total + minutes + seconds / 60;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Album Info */}
        <div className="col-lg-4">
          <div className="d-flex flex-column align-items-center">
            <div className="position-relative mb-4">
              <img 
                src={album.coverImage} 
                alt={`${album.title} cover`} 
                className="img-fluid rounded-3 shadow-lg" 
                style={{ width: '100%', maxWidth: '350px' }}
              />
              <button 
                className="btn btn-primary rounded-circle position-absolute"
                style={{ 
                  bottom: '15px', 
                  right: '15px', 
                  width: '70px', 
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <BsFillPlayFill size={28} />
              </button>
            </div>
            <h1 className="fw-bold mt-3 mb-1">{album.title}</h1>
            <h5 className="text-muted mb-3">{album.artist} • {album.releaseYear}</h5>
            
            {/* Album Details */}
            <div className="card shadow-sm w-100 mb-4">
              <div className="card-body">
                <p className="mb-3">{album.description}</p>
                <div className="d-flex flex-wrap">
                  <div className="me-4 mb-2">
                    <strong>Genre:</strong> <span className="text-muted">{album.genre}</span>
                  </div>
                  <div className="me-4 mb-2">
                    <strong>Label:</strong> <span className="text-muted">{album.label}</span>
                  </div>
                  <div className="me-4 mb-2">
                    <strong>Songs:</strong> <span className="text-muted">{album.songs.length}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Duration:</strong> <span className="text-muted">{totalDuration()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-3 w-100">
              <button className="btn btn-primary flex-grow-1">
                <BsFillPlayFill className="me-2" size={20} />
                Play All
              </button>
              <button className="btn btn-outline-secondary flex-grow-1">
                <IoMdDownload className="me-2" />
                Download
              </button>
              <button className="btn btn-outline-secondary">
              <i className="bi bi-share"></i>
              </button>
              <button className="btn btn-outline-secondary">
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>
        </div>

        {/* Song List */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th style={{ width: '60px' }}></th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th className="text-center">Views</th>
                    <th className="text-center" style={{ width: '80px' }}>
                      <HiOutlineClock size={18} />
                    </th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {album.songs.map((song) => (
                    <tr key={song.id} className="align-middle">
                      <td className="text-muted">{song.id}</td>
                      <td>
                        <img 
                          src={song.thumbnail} 
                          alt={song.title}
                          className="rounded"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div>{song.title}</div>
                      </td>
                      <td className="text-muted">{song.artist}</td>
                      <td className="text-center text-muted">{song.views}</td>
                      <td className="text-center text-muted">{song.duration}</td>
                      <td>
                        <button 
                          className="btn btn-link text-decoration-none p-0" 
                          onClick={() => handleLikeToggle(song.id)}
                        >
                          {song.liked ? (
                            <BsHeartFill className="text-danger" size={18} />
                          ) : (
                            <BsHeart size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlbumPage;