import React, { useEffect, useState } from 'react';
import { BsSearch } from '@react-icons/all-files/bs/BsSearch';
import { BsFillPlayFill } from '@react-icons/all-files/bs/BsFillPlayFill';
import { BsFilter } from '@react-icons/all-files/bs/BsFilter';
import { Outlet, useNavigate } from 'react-router-dom';
import { IoMdAddCircle } from '@react-icons/all-files/io/IoMdAddCircle';
import AddAlbumForm from './AddAlbumForm';
interface Album {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  coverImage: string;
  genre: string;
  tracks: number;
}

const AlbumsCollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const handleOpenCreateDialog = (): void => {
    setShowCreateDialog(true);
  };

  const handleCloseCreateDialog = (): void => {
    setShowCreateDialog(false);
  };
  const handleCreateAlbum = (
    formData:{ 
              title: string; 
              artist: string; 
              coverImage: string; 
              genre: string; releaseYear: number, 
              tracks: number }
    ): void => {
      const newAlbumItem: Album = {
        id: `0${albums.length + 1}`,
      title: formData.title,
      artist: formData.artist,
      releaseYear: formData.releaseYear,
      coverImage: formData.coverImage,
      genre: formData.genre,
      tracks: formData.tracks
      
      };
    setAlbums([...albums, newAlbumItem]);
    handleCloseCreateDialog();
  };
const genres = ['All', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Country', 'Jazz', 'Classical'];

useEffect(() => {
  // Fetch albums from an API or other source
  // For now, we are using the hardcoded albums array
  setAlbums([
    {
      id: 'album-1',
      title: 'Midnights',
      artist: 'Taylor Swift',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/01.png',
      genre: 'Pop',
      tracks: 13
    },
    {
      id: 'album-2',
      title: 'Un Verano Sin Ti',
      artist: 'Bad Bunny',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/02.png',
      genre: 'Reggaeton',
      tracks: 23
    },
    {
      id: 'album-3',
      title: 'Renaissance',
      artist: 'Beyoncé',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/03.png',
      genre: 'R&B',
      tracks: 16
    },
    {
      id: 'album-4',
      title: 'Harry\'s House',
      artist: 'Harry Styles',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/04.png',
      genre: 'Pop',
      tracks: 13
    },
    {
      id: 'album-5',
      title: 'Dawn FM',
      artist: 'The Weeknd',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/05.png',
      genre: 'R&B',
      tracks: 16
    },
    {
      id: 'album-6',
      title: 'Honestly, Nevermind',
      artist: 'Drake',
      releaseYear: 2022,
      coverImage: '/assets/images/dashboard/06.png',
      genre: 'Hip-Hop',
      tracks: 14
    },
    {
      id: 'album-7',
      title: 'SOUR',
      artist: 'Olivia Rodrigo',
      releaseYear: 2021,
      coverImage: '/assets/images/dashboard/07.png',
      genre: 'Pop',
      tracks: 11
    },
    {
      id: 'album-8',
      title: 'Planet Her',
      artist: 'Doja Cat',
      releaseYear: 2021,
      coverImage: '/assets/images/dashboard/08.png',
      genre: 'Pop',
      tracks: 14
    },
    {
      id: 'album-9',
      title: 'The Tortured Poets Department',
      artist: 'Taylor Swift',
      releaseYear: 2024,
      coverImage: '/assets/images/dashboard/09.png',
      genre: 'Pop',
      tracks: 16
    },
    {
      id: 'album-10',
      title: 'Folklore',
      artist: 'Taylor Swift',
      releaseYear: 2020,
      coverImage: '/assets/images/dashboard/10.png',
      genre: 'Alternative',
      tracks: 16
    },
    {
      id: 'album-11',
      title: 'Evermore',
      artist: 'Taylor Swift',
      releaseYear: 2020,
      coverImage: '/assets/images/dashboard/11.png',
      genre: 'Alternative',
      tracks: 15
    },
    {
      id: 'album-12',
      title: 'After Hours',
      artist: 'The Weeknd',
      releaseYear: 2020,
      coverImage: '/assets/images/dashboard/12.png',
      genre: 'R&B',
      tracks: 14
    }
  ]);
}, []);
// Filter albums based on search term and selected genre
const filteredAlbums = albums.filter(album => {
  const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesGenre = selectedGenre === 'All' || album.genre === selectedGenre;
  return matchesSearch && matchesGenre;
});

const handleAlbumClick = (albumId: string) => {
  // In a real app, this would navigate to the album detail page with the ID
  navigate(`album / ${ albumId }`);
};

return (
  <>
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">

          {/* Featured Albums Section */}
          <div className="mb-5">
            <h3 className="mb-3">Featured Albums</h3>
            <div className="row g-4">
              {/* Create Album Card */}
              <div className="col-xl-3 col-md-6 mb-3">
                <div
                  className="empty-album rounded-lg shadow-sm"
                  style={{
                    background: "linear-gradient(180deg, #f8f9fa 0%, #f8f9fa 100%)",
                    border: "1px dashed #e7eaec",
                    borderRadius: "10px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "20px",
                    minHeight: "200px",
                    transition: "all 0.3s ease"
                  }}
                  onClick={handleOpenCreateDialog}
                  onMouseOver={(e: React.MouseEvent<HTMLDivElement>) =>
                    e.currentTarget.style.backgroundColor = "#f0f0f0"
                  }
                  onMouseOut={(e: React.MouseEvent<HTMLDivElement>) =>
                    e.currentTarget.style.backgroundColor = "#f8f9fa"
                  }
                >
                  <div className="content"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <IoMdAddCircle
                      style={{
                        fontSize: "48px",
                        color: "#007bff",
                        marginBottom: "15px"
                      }}
                    />
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#333",
                        fontWeight: "500"
                      }}
                    >Tạo album mới</span>
                  </div>
                </div>
              </div>
              {filteredAlbums.slice(0, 4).map((album) => (
                <div key={album.id} className="col-md-6 col-lg-3">
                  <div
                    className="card h-100 border-0 shadow-sm position-relative album-card"
                    onClick={() => handleAlbumClick(album.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="position-relative">
                      <img
                        src={album.coverImage}
                        className="card-img-top"
                        alt={album.title}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <div
                        className="position-absolute top-0 end-0 bottom-0 start-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 play-overlay"
                        style={{ transition: 'opacity 0.3s ease' }}
                      >
                        <button className="btn btn-primary rounded-circle">
                          <BsFillPlayFill size={24} />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title mb-1">{album.title}</h5>
                      <p className="card-text text-muted">{album.artist}</p>
                      <div className="d-flex justify-content-between">
                        <span className="badge bg-light text-dark">{album.genre}</span>
                        <small className="text-muted">{album.releaseYear}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Albums Grid */}
          <h3 className="mb-3">All Albums</h3>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
            {filteredAlbums.map((album) => (
              <div key={album.id} className="col">
                <div
                  className="card h-100 border-0 album-grid-card"
                  onClick={() => handleAlbumClick(album.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <img
                      src={album.coverImage}
                      className="card-img-top rounded-3 shadow-sm"
                      alt={album.title}
                    />
                    <div
                      className="position-absolute top-0 end-0 bottom-0 start-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 play-overlay rounded-3"
                      style={{ transition: 'opacity 0.3s ease' }}
                    >
                      <button className="btn btn-sm btn-primary rounded-circle">
                        <BsFillPlayFill size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="card-body px-0 pt-3 pb-0">
                    <h6 className="card-title mb-1 text-truncate">{album.title}</h6>
                    <p className="card-text text-muted small mb-1">{album.artist}</p>
                    <p className="card-text small text-muted">
                      {album.tracks} tracks • {album.releaseYear}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for hover effects */}
      <style>{`
        .album-card:hover .play-overlay,
        .album-grid-card:hover .play-overlay {
          opacity: 1 !important;
        }
        
        .album-card:hover,
        .album-grid-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        
        .album-grid-card {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
    <AddAlbumForm
      isOpen={showCreateDialog}
      onClose={handleCloseCreateDialog}
      onCreateAlbum={handleCreateAlbum}
    />
    <Outlet />
  </>

);
};

export default AlbumsCollectionPage;