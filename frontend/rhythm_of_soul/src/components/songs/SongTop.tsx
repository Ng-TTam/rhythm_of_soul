import { useEffect, useState } from "react";
import { getTopSongWeekly } from "../../services/postService";
import { PostResponse } from "../../model/post/post";
import { formatNumberShort } from "../../pages/feed/utils/formatNumberShort";

export default function SongTop() {
  const [songs, setSongs] = useState<PostResponse[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const fetchSongs = async () => {
        try {
          const data = await getTopSongWeekly(0,16);
          setSongs(data);
        } catch (error) {
          console.error("Failed to fetch songs:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSongs();
    }, []);

  // const songs = [
  //   {
  //     title: "Saturday party",
  //     artist: "john deo",
  //     listens: "8.6k",
  //     image: "../assets/images/dashboard/22.png",
  //   },
  //   {
  //     title: "Saturday party",
  //     artist: "angle wings",
  //     listens: "8.2k",
  //     image: "../assets/images/dashboard/23.png",
  //   },
  //   {
  //     title: "Ferrari",
  //     artist: "smith euc",
  //     listens: "7.9k",
  //     image: "../assets/images/dashboard/24.png",
  //   },
  //   {
  //     title: "Saturday party",
  //     artist: "john deo",
  //     listens: "8.6k",
  //     image: "../assets/images/dashboard/22.png",
  //   },
  //   {
  //     title: "Saturday party",
  //     artist: "angle wings",
  //     listens: "8.2k",
  //     image: "../assets/images/dashboard/23.png",
  //   },
  //   {
  //     title: "Ferrari",
  //     artist: "smith euc",
  //     listens: "7.9k",
  //     image: "../assets/images/dashboard/24.png",
  //   },
  //   {
  //     title: "Saturday party",
  //     artist: "angle wings",
  //     listens: "8.2k",
  //     image: "../assets/images/dashboard/23.png",
  //   },
  //   {
  //     title: "Ferrari",
  //     artist: "smith euc",
  //     listens: "7.9k",
  //     image: "../assets/images/dashboard/24.png",
  //   },
  // ];

  if (isLoading) return <SkeletonSongList />;

  if (songs.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <img className="mb3 " src="../assets/images/undraw_server-down_lxs9.svg" style={{ width: "200px", marginBottom: "20px" }} alt="no data" />
        <p className="text-muted">Fail to get data!</p>
      </div>
    );
  }

  return (
    <div className="row">
      {Array.from({ length: 4 }, (_, colIndex) => (
        <div className="col-xl-3 col-lg-6 col-md-6 mb-3" key={colIndex}>
          <ul className="p-0 list-unstyled mb-0">
            {songs
              .filter((_, songIndex) => songIndex % 4 === colIndex)
              .map((song, i) => (
                <li key={i} className={`border-bottom ${i === 0 ? "pb-3" : "py-3"}`}>
                  <div className="d-flex">
                    <img src={song.content?.imageUrl} className="img-fluid rounded me-3 avatar-55" alt="song" />
                    <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                      <div>
                        <a href="music-player.html" className="text-capitalize h5 mt-3">
                          {song.content?.title}
                        </a>
                        <br />
                        <small className="text-capitalize">{song.account_id}</small>
                      </div>
                      <div className="d-flex align-items-center heading-color">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                          <path
                            d="M15.7727 4.89531C15.025 4.14014 14.1357 3.53986 13.1558 3.12883C12.1758 2.71781 11.1244 2.50412 10.0617 2.5H10C7.84512 2.5 5.77849 3.35602 4.25476 4.87976C2.73102 6.40349 1.875 8.47012 1.875 10.625V15C1.875 15.4973 2.07254 15.9742 2.42417 16.3258C2.77581 16.6775 3.25272 16.875 3.75 16.875H5C5.49728 16.875 5.97419 16.6775 6.32583 16.3258C6.67746 15.9742 6.875 15.4973 6.875 15V11.875C6.875 11.3777 6.67746 10.9008 6.32583 10.5492C5.97419 10.1975 5.49728 10 5 10H3.15313C3.30905 8.29188 4.09785 6.70373 5.36466 5.54736C6.63147 4.39099 8.28477 3.74991 10 3.75H10.0523C11.7604 3.75722 13.4042 4.40211 14.6616 5.55827C15.9189 6.71444 16.6991 8.29851 16.8492 10H15C14.5027 10 14.0258 10.1975 13.6742 10.5492C13.3225 10.9008 13.125 11.3777 13.125 11.875V15C13.125 15.4973 13.3225 15.9742 13.6742 16.3258C14.0258 16.6775 14.5027 16.875 15 16.875H16.25C16.7473 16.875 17.2242 16.6775 17.5758 16.3258C17.9275 15.9742 18.125 15.4973 18.125 15V10.625C18.1291 9.56217 17.9234 8.50898 17.5197 7.52577C17.1161 6.54257 16.5224 5.64868 15.7727 4.89531Z"
                            fill="#4A525F"
                          />
                        </svg>
                        <small className="ms-2">{formatNumberShort(song.view_count)}</small>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SkeletonSongList({ length = 4 }: { length?: number }) {
  return (
    <div className="row">
      {Array.from({ length }, (_, colIndex) => (
        <div className="col-xl-3 col-lg-6 col-md-6 mb-3" key={colIndex}>
          <ul className="p-0 list-unstyled mb-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className={`border-bottom ${i === 0 ? "pb-3" : "py-3"}`}>
                <div className="d-flex">
                  <div className="skeleton rounded me-3" style={{ width: 55, height: 55 }} />
                  <div className="w-100">
                    <div className="skeleton mb-2" style={{ width: "70%", height: 20 }} />
                    <div className="skeleton mb-2" style={{ width: "50%", height: 14 }} />
                    <div className="skeleton" style={{ width: "30%", height: 14 }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <style>
        {`
        .skeleton {
          background-color: #e2e5e7;
          background-image: linear-gradient(
            90deg,
            #e2e5e7 0px,
            #f3f3f3 40px,
            #e2e5e7 80px
          );
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite linear;
          border-radius: 0.5rem;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }`}
      </style>
    </div>
  );
}
