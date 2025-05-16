import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import SkeletonCardSongLoad from "./SkeletonCardSongLoad";

type TrendingSong = {
  title: string;
  artist: string;
  image: string;
};

export default function SongTrending() {
  const trendingSong = useState<TrendingSong[]>();
  const [isLoading, setLoading] = useState<Boolean>(true);

  useEffect(() => {}, []);

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

  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={15} viewBox="0 0 14 15" fill="none">
      <path
        d="M10.9375 4V9.6875C10.9375 9.80353 10.8914 9.91481 10.8094 9.99686C10.7273 10.0789 10.616 10.125 10.5 10.125C10.384 10.125 10.2727 10.0789 10.1906 9.99686C10.1086 9.91481 10.0625 9.80353 10.0625 9.6875V5.05602L3.80953 11.3095C3.72744 11.3916 3.6161 11.4377 3.5 11.4377C3.3839 11.4377 3.27256 11.3916 3.19047 11.3095C3.10838 11.2274 3.06226 11.1161 3.06226 11C3.06226 10.8839 3.10838 10.7726 3.19047 10.6905L9.44398 4.4375H4.8125C4.69647 4.4375 4.58519 4.39141 4.50314 4.30936C4.42109 4.22731 4.375 4.11603 4.375 4C4.375 3.88397 4.42109 3.77269 4.50314 3.69064C4.58519 3.60859 4.69647 3.5625 4.8125 3.5625H10.5C10.616 3.5625 10.7273 3.60859 10.8094 3.69064C10.8914 3.77269 10.9375 3.88397 10.9375 4Z"
        fill="#4A525F"
      />
    </svg>
  );

  if(isLoading) return <SkeletonCardSongLoad length={7} />

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
