import React, { useState } from "react";
import SkeletonCardSongLoad from "./SkeletonCardSongLoad";

export default function GenresTop() {
  const [isLoading, setLoading] = useState<boolean>(false);
  // const [genres, setGenres] = useState([]);

  const genres = [
    { title: "sorrow", img: "17.png" },
    { title: "relax", img: "18.png" },
    { title: "travel", img: "19.png" },
    { title: "party", img: "20.png" },
    { title: "19’s retro song", img: "21.png" },
    { title: "relax", img: "18.png" },
  ];

  if (isLoading) return <SkeletonCardSongLoad length={7}/>;

  if (genres.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <img className="mb3 " src="../assets/images/undraw_server-down_lxs9.svg" style={{ width: "200px", marginBottom: "20px" }} alt="no data" />
        <p className="text-muted">Fail to get data!</p>
      </div>
    );
  }

  return (
    <div className="swiper overflow-hidden" data-swiper="geners-slider">
      <ul className="swiper-wrapper d-flex flex-nowrap overflow-auto p-0 list-unstyled mb-0 gap-3">
        {genres.map((item, index) => (
          <li className="swiper-slide mb-3 swiper-slide-duplicate" style={{ minWidth: "240.667px", width: "auto" }} key={index}>
            <img src={`../assets/images/dashboard/${item.img}`} className="mb-3 img-fluid rounded-3" alt="song-img" />
            <a href="music-player.html" className="text-capitalize line-count-1 h5 d-block text-center">
              {item.title}
            </a>
            {/* <small className="fw-normal text-capitalize line-count-1">top 12 songs from travels and</small> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
