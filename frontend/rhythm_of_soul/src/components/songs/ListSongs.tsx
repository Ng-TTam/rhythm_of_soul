import React from 'react';

interface Song {
  id: number;
  image: string;
  name: string;
  genre: string;
  writer: string;
  singer: string;
  listener: string;
  reviews: number;
}

interface ListSongsProps {
  songs: Song[];
}

export default function ListSongs({ songs }: ListSongsProps) {
  return (
    <div className="card-body px-0">
      <div className="table-data-top table-responsive">
        <table className="table mb-0" id="datatable" data-toggle="data-table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Image</th>
              <th scope="col">Song Name</th>
              <th scope="col">Genres</th>
              <th scope="col">Writer</th>
              <th scope="col">Singer</th>
              <th scope="col">Listener</th>
              <th scope="col">Reviews</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={song.image}
                    className="img-fluid avatar-50 rounded-3"
                    alt="song"
                  />
                </td>
                <td>{song.name}</td>
                <td>{song.genre}</td>
                <td>{song.writer}</td>
                <td>{song.singer}</td>
                <td>{song.listener}</td>
                <td>{song.reviews}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-soft-primary rounded-pill">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-soft-danger rounded-pill">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
