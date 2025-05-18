import React, { useState } from 'react';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH'; 
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'; 
import {  FaDownload } from '@react-icons/all-files/fa/FaDownload';
import {  FaPlay } from '@react-icons/all-files/fa/FaPlay';  // React Icons// React Icons

interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    time: string;
    img: string;
}
export default function PlayListDetail() {
  // Quản lý danh sách bài hát bằng useState
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '01',
      title: 'The Girl',
      artist: 'Snoods Smith Jonas',
      album: 'Heart Is Beating',
      time: '4:21',
      img: '../assets/images/dashboard/05.png',
    },
    {
      id: '02',
      title: 'Infinity',
      artist: 'Edyta Gorniak',
      album: 'My Crying Eyes',
      time: '3:21',
      img: '../assets/images/dashboard/06.png',
    },
    {
      id: '03',
      title: 'Everything I Want',
      artist: 'Edyta Gorniak',
      album: 'My Lovely Dad',
      time: '2:21',
      img: '../assets/images/dashboard/07.png',
    },
    {
      id: '04',
      title: 'The Silent One',
      artist: 'Edyta Gorniak',
      album: 'Travel Mix',
      time: '3:21',
      img: '../assets/images/dashboard/08.png',
    },
    {
      id: '05',
      title: 'Just Perfect',
      artist: 'Nil Ana Meet Nagak',
      album: 'Way Of Right',
      time: '4:21',
      img: '../assets/images/dashboard/10.png',
    },
  ]);

  // Hàm xóa bài hát
  const handleDelete = (id :string) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  // Hàm xử lý phát nhạc (giả lập)
  const handlePlay = (song : Song) => {
    console.log(`Playing: ${song.title} by ${song.artist}`);
    // Thêm logic phát nhạc thực tế ở đây, ví dụ: sử dụng HTML5 Audio
    // const audio = new Audio(song.audioUrl);
    // audio.play();
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row g-4">
        {/* Playlist Info */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <img
              src="../assets/images/dashboard/01.png"
              alt="Playlist Cover"
              className="card-img-top img-fluid"
              style={{ height: '250px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h3 className="card-title mb-3 fw-bold">OK Playlist</h3>
              <div className="d-flex align-items-center mb-4">
                <span className="fw-semibold me-3">Phong Do</span>
                <span className="fw-semibold ps-3 border-start">Công khai</span>
              </div>
              <button className="btn btn-primary w-100">Play Music</button>
            </div>
          </div>
        </div>

        {/* Playlist Songs */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <h4 className="card-title p-4 mb-0 fw-semibold">Songs</h4>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">No.</th>
                      <th scope="col">Title</th>
                      <th scope="col">Album</th>
                      <th scope="col">Time</th>
                      <th scope="col">Play</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={index}>
                        <td className="ps-4">{song.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={song.img}
                              alt={song.title}
                              className="rounded-circle me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <p className="mb-0 fw-medium">{song.title}</p>
                              <small className="text-muted">{song.artist}</small>
                            </div>
                          </div>
                        </td>
                        <td>{song.album}</td>
                        <td>{song.time}</td>
                        <td>
                          <button
                            className="btn-outline-success"
                            onClick={() => handlePlay(song)}
                            title="Play"
                            
                          >
                            <FaPlay size={14} />
                          </button>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-link text-muted p-0"
                              type="button"
                              id={`dropdownMenuButton${index}`}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <FaEllipsisH size={20} />
                            </button>
                            <ul
                              className="dropdown-menu dropdown-menu-end shadow-sm"
                              aria-labelledby={`dropdownMenuButton${index}`}
                            >
                              <li>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                  <FaEye className="me-2" /> View
                                </a>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleDelete(song.id)}
                                >
                                  <FaTrash className="me-2" /> Delete
                                </button>
                              </li>
                              <li>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                  <FaDownload className="me-2" /> Download
                                </a>
                              </li>
                            </ul>
                          </div>
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

      {/* Custom CSS để tinh chỉnh giao diện */}
      <style >{`
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
        }
        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
        .btn-outline-success {
          border:none;
          color: black;
            background-color: transparent;
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
        .dropdown-menu {
          min-width: 150px;
        }
        .dropdown-item {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }
        .dropdown-item:hover {
          background-color: #e9ecef;
        }
      `}</style>
    </div>
  );
}