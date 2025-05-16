import React, { useState } from "react";
import SkeletonCardSongLoad from "../songs/SkeletonCardSongLoad";

export default function ArtistTop() {
const [isLoading, setLoading] = useState<boolean>(true);

  const artists = [
    {
      img: "38.png",
      name: "Eliana d’Cruz",
      role: "playback singer",
    },
    {
      img: "39.png",
      name: "Alex Williams",
      role: "composer",
    },
    {
      img: "40.png",
      name: "Omen Smith",
      role: "playback singer",
    },
    {
      img: "41.png",
      name: "Alexa Jonas",
      role: "music player",
    },
    {
      img: "42.png",
      name: "Koruna Truss",
      role: "playback singer",
    },
    {
      img: "43.png",
      name: "Vibrato Eruct",
      role: "playback singer",
    },
    {
      img: "44.png",
      name: "Mainours Kian",
      role: "playback singer",
    },
  ];

  if(isLoading) return <SkeletonCardSongLoad length={7} />

  return (
    <div className="d-flex overflow-auto flex-nowrap">
      {artists.map((artist, index) => (
        <div
          key={index}
          className="me-3 text-center"
          style={{
            flex: "0 0 16.666%", // Hiển thị 6 card trên 1 hàng
            minWidth: "150px",
            maxWidth: "200px",
          }}
        >
          <img
            src={`../assets/images/dashboard/${artist.img}`}
            className="img-fluid rounded-3 mb-2"
            style={{
              aspectRatio: "1 / 1",
              objectFit: "cover",
              width: "100%",
            }}
            alt={artist.name}
          />
          <a href="music-player.html" className="text-capitalize h5 d-block mb-1">
            {artist.name}
          </a>
          <small className="fw-normal text-muted text-capitalize d-block">{artist.role}</small>
        </div>
      ))}
    </div>
  );
}
