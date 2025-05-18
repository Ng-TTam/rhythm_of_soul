import { useEffect, useState } from "react";
import SkeletonCardSongLoad from "./SkeletonCardSongLoad";

type TrendingSong = {
  title: string;
  artist: string;
  image: string;
};

export default function SongTrending() {
  const trendingSong = useState<TrendingSong[]>();
  const [isLoading, setLoading] = useState<Boolean>(true);

  useEffect(() => {

  }, []);

  const trendingSongs: TrendingSong[] = [
    {
      title: "the girl",
      artist: "snoods smith Jonas",
      image: "../assets/images/dashboard/05.png",
    },
    {
      title: "masinc party album",
      artist: "kerana euc veena",
      image: "../assets/images/dashboard/06.png",
    },
    {
      title: "the silent one",
      artist: "Alex Williams",
      image: "../assets/images/dashboard/07.png",
    },
    {
      title: "just perfect",
      artist: "karuna truss",
      image: "../assets/images/dashboard/08.png",
    },
    {
      title: "everything i want",
      artist: "Neha arena",
      image: "../assets/images/dashboard/09.png",
    },
    {
      title: "infinity",
      artist: "nil ana meet nagak",
      image: "../assets/images/dashboard/10.png",
    },
  ];

  if(isLoading) return <SkeletonCardSongLoad length={7} />

  if (trendingSongs.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <img className="mb3 " src="../assets/images/undraw_server-down_lxs9.svg" style={{ width: "200px", marginBottom: "20px" }} alt="no data" />
        <p className="text-muted">Fail to get data!</p>
      </div>
    );
  }

  return (
      <ul className="row row-cols-lg-6 row-cols-md-4 row-cols-2 list-unstyled mb-0">
        {trendingSongs.map((song, index) => (
          <li key={index} className="col">
            <div className="card">
              <div className="card-body">
                <img src={song.image} className="mb-3 img-fluid rounded-3" alt={song.title} />
                <a href="music-player.html" className="text-capitalize line-count-1 h5 d-block">
                  {song.title}
                </a>
                <small className="fw-normal text-capitalize line-count-1">by {song.artist}</small>
              </div>
            </div>
          </li>
        ))}
      </ul>
  );
}
