import React from 'react';

interface Song {
  id: number;
  image: string;
  name: string;
  genres: string;
  writer: string;
  singer: string;
  listener: string;
  reviews: string;
}

interface AdminSongProps {
  songs: Song[];
}

export default function AdminSong({ songs }: AdminSongProps) {
  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h4 className="mb-0">Music List</h4>
                <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvassong">
                  + Add New Song
                </button>
              </div>
            </div>

            {/* Table phần danh sách bài hát */}
            <div className="card-body px-0">
              <div className="table-data-top table-responsive">
                <table className="table mb-0" id="datatable">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Image</th>
                      <th>Song Name</th>
                      <th>Genres</th>
                      <th>Writer</th>
                      <th>Singer</th>
                      <th>Listener</th>
                      <th>Reviews</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={song.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={song.image} alt={song.name} className="img-fluid avatar-50 rounded-3" />
                        </td>
                        <td>{song.name}</td>
                        <td>{song.genres}</td>
                        <td>{song.writer}</td>
                        <td>{song.singer}</td>
                        <td>{song.listener}</td>
                        <td>{song.reviews}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <a className="btn btn-soft-primary btn-icon btn-sm rounded-pill" href="#" role="button">
                              ✏️
                            </a>
                            <a className="btn btn-soft-primary btn-icon btn-sm rounded-pill" href="#" role="button">
                              🗑️
                            </a>
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
    </div>
  );
}
