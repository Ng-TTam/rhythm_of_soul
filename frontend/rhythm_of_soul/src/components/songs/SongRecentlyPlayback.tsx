import { useEffect, useState } from "react";
import SkeletonCardSongLoad from "./SkeletonCardSongLoad";
import { getSongRecently } from "../../services/postService";
import { PostResponse } from "../../model/post/post";

export default function SongRecentlyPlayback() {
  const [isLoading, setLoading] = useState(true);
  const [songs, setSongs] = useState<PostResponse[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongRecently();
        setSongs(data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (isLoading) return <SkeletonCardSongLoad length={7} />;

  if (songs.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <img className="mb3 " src="../assets/images/undraw_no-data_ig65.svg" style={{ width: "150px", marginBottom: "20px" }} alt="no data" />
        <p className="text-muted">No data! You haven't heard anything lately.</p>
      </div>
    );
  }

  return (
    <div className="d-flex overflow-auto flex-nowrap">
      {songs.map((song, index) => (
        <div
          key={index}
          className="card me-3 flex-grow-1"
          style={{
            flex: "0 0 16.666%",
            minWidth: "150px",
            maxWidth: "200px",
          }}
        >
          <div className="card-body text-center p-2">
            <img
              src={`../assets/images/dashboard/${song.content?.imageUrl}`}
              className="img-fluid rounded-3 mb-2"
              style={{
                aspectRatio: "1 / 1",
                objectFit: "cover",
                width: "100%",
              }}
              alt={song.content?.title}
            />
            <a href="music-player.html" className="text-capitalize h6 d-block mb-1">
              {song.content?.title}
            </a>
            <small className="text-muted text-capitalize">{song.account_id}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
