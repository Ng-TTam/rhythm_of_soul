import React from "react";

interface Artist {
  name: string;
  email: string;
  joinedDate: string;
  totalSongs: number;
  avatar: string;
}

interface Feedback {
  avatar: string;
  name: string;
  comment: string;
  time: string;
}

interface User {
  avatar: string;
  name: string;
  email: string;
  time: string;
}

interface DashboardProps {
  totalUsers: number;
  totalArtists: number;
  totalPlaylists: number;
  totalSongs: number;
  topArtists: Artist[];
  recentUsers: User[];
  songFeedbacks: Feedback[];
}

export default function Dashboard({
  totalUsers,
  totalArtists,
  totalPlaylists,
  totalSongs,
  topArtists,
  recentUsers,
  songFeedbacks,
}: DashboardProps) {
  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <div className="row">
        {/* Thống kê */}
        <StatCard title="Total Users" count={totalUsers} icon="bi-people" />
        <StatCard title="Total Artists" count={totalArtists} icon="bi-person-circle" />
        <StatCard title="Total Playlists" count={totalPlaylists} icon="bi-collection-play" />
        <StatCard title="Total Songs" count={totalSongs} icon="bi-music-note-list" />

        {/* Top artists */}
        <div className="col-xl-6 col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title">Top Artists</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {topArtists.map((artist, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="avatar-50 rounded-pill img-fluid me-3"
                    />
                    <div>
                      <h6 className="mb-0">{artist.name}</h6>
                      <p className="mb-0 text-muted">{artist.email}</p>
                      <small className="text-muted">Joined: {artist.joinedDate}</small>
                      <p className="mb-0">Total Songs: {artist.totalSongs}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent users */}
        <div className="col-xl-6 col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title">Recent Users</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {recentUsers.map((user, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="avatar-50 rounded-pill img-fluid me-3"
                    />
                    <div>
                      <h6 className="mb-0">{user.name}</h6>
                      <p className="mb-0 text-muted">{user.email}</p>
                      <small className="text-muted">{user.time}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title">Song Feedback</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {songFeedbacks.map((fb, idx) => (
                  <li key={idx} className="d-flex align-items-start mb-3">
                    <img
                      src={fb.avatar}
                      alt={fb.name}
                      className="avatar-50 rounded-pill img-fluid me-3"
                    />
                    <div>
                      <h6 className="mb-1">{fb.name}</h6>
                      <p className="mb-1">{fb.comment}</p>
                      <small className="text-muted">{fb.time}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon }: { title: string; count: number; icon: string }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="card">
        <div className="card-body text-center">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <i className={`bi ${icon} fs-3`}></i>
            <h4 className="mb-0">{count.toLocaleString()}</h4>
          </div>
          <p className="mb-0 text-muted">{title}</p>
        </div>
      </div>
    </div>
  );
}
