import React, { useEffect } from "react";
import Aside from "../../components/Aside";
import Nav from "../../components/Nav";
import PlaybackBar from "../../components/songs/PlaybackBar";
import SongTop from "../../components/songs/SongTop";
import SongTrending from "../../components/songs/SongTrending";
import SongRecentlyPlayback from "../../components/songs/SongRecentlyPlayback";
import GenresTop from "../../components/songs/GenresTop";
import ArtistTop from "../../components/artists/ArtistTop";

export default function Dashboard() {
  useEffect(() => {
    const scripts = [
      "../assets/js/core/libs.min.js",
      "../assets/vendor/sheperd/dist/js/sheperd.min.js",
      "../assets/js/plugins/tour.js",
      "../assets/js/plugins/slider-tabs.js",
      "../assets/vendor/swiperSlider/swiper-bundle.min.js",
      "../assets/js/plugins/swiper-slider.js",
      "../assets/vendor/lodash/lodash.min.js",
      "../assets/js/iqonic-script/utility.min.js",
      "../assets/js/iqonic-script/setting.min.js",
      // "../assets/js/setting-init.js",
      "../assets/js/core/external.min.js",
      "../assets/js/charts/widgetchartsf700.js?v=1.0.1",
      "../assets/js/charts/dashboardf700.js?v=1.0.1",
      "../assets/js/music-playerf700.js?v=1.0.1",
      "../assets/js/muzikf700.js?v=1.0.1",
      "../assets/js/sidebarf700.js?v=1.0.1",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = "/" + src;
      script.defer = true;
      document.body.appendChild(script);
    });
  }, []);

  return (
    <>
      {/* <div id="loading">
        <div className="loader simple-loader">
          <div className="loader-body ">
            <img
              src="../assets/images/loader.gif"
              alt="loader"
              className=" img-fluid "
            />
          </div>
        </div>
      </div> */}

      <Aside />

      <main className="main-content">
        <Nav /> 

        <div className="content-inner container-fluid pb-0" id="page_layout">
          <div className="row mb-5">
            <div className="col-lg-12">
              <div className="card-header">
                <div className="header-title">
                  <h4 className="card-title text-capitalize mb-3">
                    playlist by artist
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="bg-soft-danger position-relative  rounded-3 card-box mb-3 ">
                <img
                  src="../assets/images/dashboard/01.png"
                  className="img-fluid mx-auto d-block"
                  alt="play-img"
                />
                <div className="d-flex align-items-center play-list-icon">
                  <svg
                    className="text-danger"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Play">
                      <path
                        id="Fill 1"
                        opacity="0.4"
                        d="M21.8334 11.0052C21.8334 16.9732 16.9709 21.8334 11 21.8334C5.02914 21.8334 0.166687 16.9732 0.166687 11.0052C0.166687 5.02679 5.02914 0.166687 11 0.166687C16.9709 0.166687 21.8334 5.02679 21.8334 11.0052Z"
                        fill="currentColor"
                      />
                      <path
                        id="Fill 4"
                        d="M15.3333 11.0053C15.3333 11.2791 15.2472 11.5539 15.0748 11.774C15.0425 11.8172 14.8917 11.9952 14.7732 12.111L14.7086 12.1742C13.8037 13.1335 11.5524 14.5762 10.4106 15.0385C10.4106 15.049 9.73201 15.3239 9.40885 15.3334H9.36577C8.87027 15.3334 8.40708 15.0606 8.1701 14.6183C8.04084 14.3751 7.92235 13.6695 7.91158 13.66C7.81463 13.0272 7.75 12.0583 7.75 10.9948C7.75 9.87957 7.81463 8.86758 7.93312 8.24627C7.93312 8.23574 8.05161 7.66709 8.12701 7.47754C8.2455 7.2048 8.46094 6.97207 8.73023 6.82465C8.94567 6.72039 9.17188 6.66669 9.40885 6.66669C9.65661 6.67827 10.1198 6.83518 10.3029 6.90889C11.5094 7.37224 13.8145 8.88864 14.6978 9.81533C14.8486 9.96276 15.0102 10.1428 15.0533 10.1839C15.2364 10.4156 15.3333 10.6999 15.3333 11.0053Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  <span className="ms-2 fw-semibold text-capitalize">
                    12 tracks
                  </span>
                </div>
              </div>
              <a href="music-player.html" className="text-capitalize h5">
                Eliana d’cruz playlist
              </a>
              <small className="fw-normal line-count-1 text-capitalize">
                top 12 songs from Eliana and all type of songs.
              </small>{" "}
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="bg-soft-warning position-relative  rounded-3 card-box mb-3 ">
                <img
                  src="../assets/images/dashboard/02.png"
                  className="img-fluid mx-auto d-block"
                  alt="play-img"
                />
                <div className="d-flex align-items-center play-list-icon">
                  <svg
                    className="text-warning"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Play">
                      <path
                        id="Fill 1"
                        opacity="0.4"
                        d="M21.8334 11.0052C21.8334 16.9732 16.9709 21.8334 11 21.8334C5.02914 21.8334 0.166687 16.9732 0.166687 11.0052C0.166687 5.02679 5.02914 0.166687 11 0.166687C16.9709 0.166687 21.8334 5.02679 21.8334 11.0052Z"
                        fill="currentColor"
                      />
                      <path
                        id="Fill 4"
                        d="M15.3333 11.0053C15.3333 11.2791 15.2472 11.5539 15.0748 11.774C15.0425 11.8172 14.8917 11.9952 14.7732 12.111L14.7086 12.1742C13.8037 13.1335 11.5524 14.5762 10.4106 15.0385C10.4106 15.049 9.73201 15.3239 9.40885 15.3334H9.36577C8.87027 15.3334 8.40708 15.0606 8.1701 14.6183C8.04084 14.3751 7.92235 13.6695 7.91158 13.66C7.81463 13.0272 7.75 12.0583 7.75 10.9948C7.75 9.87957 7.81463 8.86758 7.93312 8.24627C7.93312 8.23574 8.05161 7.66709 8.12701 7.47754C8.2455 7.2048 8.46094 6.97207 8.73023 6.82465C8.94567 6.72039 9.17188 6.66669 9.40885 6.66669C9.65661 6.67827 10.1198 6.83518 10.3029 6.90889C11.5094 7.37224 13.8145 8.88864 14.6978 9.81533C14.8486 9.96276 15.0102 10.1428 15.0533 10.1839C15.2364 10.4156 15.3333 10.6999 15.3333 11.0053Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  <span className="ms-2 fw-semibold text-capitalize">
                    18 tracks
                  </span>
                </div>
              </div>
              <a href="music-player.html" className="text-capitalize h5">
                omen smith playlist
              </a>
              <small className="fw-normal line-count-1 text-capitalize">
                top 18 songs from omen and mainly party song.
              </small>{" "}
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="bg-soft-info position-relative  rounded-3 card-box mb-3 ">
                <img
                  src="../assets/images/dashboard/03.png"
                  className="img-fluid mx-auto d-block"
                  alt="play-img"
                />
                <div className="d-flex align-items-center play-list-icon">
                  <svg
                    className="text-info"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Play">
                      <path
                        id="Fill 1"
                        opacity="0.4"
                        d="M21.8334 11.0052C21.8334 16.9732 16.9709 21.8334 11 21.8334C5.02914 21.8334 0.166687 16.9732 0.166687 11.0052C0.166687 5.02679 5.02914 0.166687 11 0.166687C16.9709 0.166687 21.8334 5.02679 21.8334 11.0052Z"
                        fill="currentColor"
                      />
                      <path
                        id="Fill 4"
                        d="M15.3333 11.0053C15.3333 11.2791 15.2472 11.5539 15.0748 11.774C15.0425 11.8172 14.8917 11.9952 14.7732 12.111L14.7086 12.1742C13.8037 13.1335 11.5524 14.5762 10.4106 15.0385C10.4106 15.049 9.73201 15.3239 9.40885 15.3334H9.36577C8.87027 15.3334 8.40708 15.0606 8.1701 14.6183C8.04084 14.3751 7.92235 13.6695 7.91158 13.66C7.81463 13.0272 7.75 12.0583 7.75 10.9948C7.75 9.87957 7.81463 8.86758 7.93312 8.24627C7.93312 8.23574 8.05161 7.66709 8.12701 7.47754C8.2455 7.2048 8.46094 6.97207 8.73023 6.82465C8.94567 6.72039 9.17188 6.66669 9.40885 6.66669C9.65661 6.67827 10.1198 6.83518 10.3029 6.90889C11.5094 7.37224 13.8145 8.88864 14.6978 9.81533C14.8486 9.96276 15.0102 10.1428 15.0533 10.1839C15.2364 10.4156 15.3333 10.6999 15.3333 11.0053Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  <span className="ms-2 fw-semibold text-capitalize">
                    16 tracks
                  </span>
                </div>
              </div>
              <a href="music-player.html" className="text-capitalize h5">
                Alexa Jonas
              </a>
              <small className="fw-normal line-count-1 text-capitalize">
                top 16 songs from Alexa and most of the relax songs.
              </small>{" "}
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="bg-soft-success position-relative  rounded-3 card-box mb-3 ">
                <img
                  src="../assets/images/dashboard/04.png"
                  className="img-fluid mx-auto d-block"
                  alt="play-img"
                />
                <div className="d-flex align-items-center play-list-icon">
                  <svg
                    className="text-success"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Play">
                      <path
                        id="Fill 1"
                        opacity="0.4"
                        d="M21.8334 11.0052C21.8334 16.9732 16.9709 21.8334 11 21.8334C5.02914 21.8334 0.166687 16.9732 0.166687 11.0052C0.166687 5.02679 5.02914 0.166687 11 0.166687C16.9709 0.166687 21.8334 5.02679 21.8334 11.0052Z"
                        fill="currentColor"
                      />
                      <path
                        id="Fill 4"
                        d="M15.3333 11.0053C15.3333 11.2791 15.2472 11.5539 15.0748 11.774C15.0425 11.8172 14.8917 11.9952 14.7732 12.111L14.7086 12.1742C13.8037 13.1335 11.5524 14.5762 10.4106 15.0385C10.4106 15.049 9.73201 15.3239 9.40885 15.3334H9.36577C8.87027 15.3334 8.40708 15.0606 8.1701 14.6183C8.04084 14.3751 7.92235 13.6695 7.91158 13.66C7.81463 13.0272 7.75 12.0583 7.75 10.9948C7.75 9.87957 7.81463 8.86758 7.93312 8.24627C7.93312 8.23574 8.05161 7.66709 8.12701 7.47754C8.2455 7.2048 8.46094 6.97207 8.73023 6.82465C8.94567 6.72039 9.17188 6.66669 9.40885 6.66669C9.65661 6.67827 10.1198 6.83518 10.3029 6.90889C11.5094 7.37224 13.8145 8.88864 14.6978 9.81533C14.8486 9.96276 15.0102 10.1428 15.0533 10.1839C15.2364 10.4156 15.3333 10.6999 15.3333 11.0053Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  <span className="ms-2 fw-semibold text-capitalize">
                    22 tracks
                  </span>
                </div>
              </div>
              <a href="music-player.html" className="text-capitalize h5">
                vibrato eruct
              </a>
              <small className="fw-normal line-count-1 text-capitalize">
                top 22 songs from vibrato and all type of songs.
              </small>{" "}
            </div>
          </div>
          <SongTrending />
          <SongRecentlyPlayback />
          <GenresTop />
          <div className="row  mb-5">
            <div className="col-lg-12">
              <div className="card-header mb-3">
                <div className="header-title d-flex align-items-center justify-content-between">
                  <h4 className="card-title text-capitalize">
                    radio station songs
                  </h4>
                  <a href="#" className="small text-body">
                    View All{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={15}
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        d="M10.9375 4V9.6875C10.9375 9.80353 10.8914 9.91481 10.8094 9.99686C10.7273 10.0789 10.616 10.125 10.5 10.125C10.384 10.125 10.2727 10.0789 10.1906 9.99686C10.1086 9.91481 10.0625 9.80353 10.0625 9.6875V5.05602L3.80953 11.3095C3.72744 11.3916 3.6161 11.4377 3.5 11.4377C3.3839 11.4377 3.27256 11.3916 3.19047 11.3095C3.10838 11.2274 3.06226 11.1161 3.06226 11C3.06226 10.8839 3.10838 10.7726 3.19047 10.6905L9.44398 4.4375H4.8125C4.69647 4.4375 4.58519 4.39141 4.50314 4.30936C4.42109 4.22731 4.375 4.11603 4.375 4C4.375 3.88397 4.42109 3.77269 4.50314 3.69064C4.58519 3.60859 4.69647 3.5625 4.8125 3.5625H10.5C10.616 3.5625 10.7273 3.60859 10.8094 3.69064C10.8914 3.77269 10.9375 3.88397 10.9375 4Z"
                        fill="#4A525F"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <ul className="row row-cols-lg-5 row-cols-md-4  row-cols-2 list-unstyled mb-0">
              <li className="col mb-3">
                <img
                  src="../assets/images/dashboard/45.png"
                  className="mb-3 img-fluid rounded-3"
                  alt="song-img"
                />
                <a
                  href="music-player.html"
                  className=" text-capitalize line-count-1 h5 d-block"
                >
                  music hits
                </a>
                <small className="fw-normal text-capitalize line-count-1">
                  music hits by rj karuna
                </small>
              </li>
              <li className="col mb-3">
                <img
                  src="../assets/images/dashboard/46.png"
                  className="mb-3 img-fluid rounded-3"
                  alt="song-img"
                />
                <a
                  href="music-player.html"
                  className=" text-capitalize line-count-1 h5 d-block"
                >
                  8917 radio hits
                </a>
                <small className="fw-normal text-capitalize line-count-1">
                  897 radio hits by rj Nina
                </small>
              </li>
              <li className="col mb-3">
                <img
                  src="../assets/images/dashboard/47.png"
                  className="mb-3 img-fluid rounded-3"
                  alt="song-img"
                />
                <a
                  href="music-player.html"
                  className=" text-capitalize line-count-1 h5 d-block"
                >
                  country music
                </a>
                <small className="fw-normal text-capitalize line-count-1">
                  country music by rj angel
                </small>
              </li>
              <li className="col mb-3">
                <img
                  src="../assets/images/dashboard/48.png"
                  className="mb-3 img-fluid rounded-3"
                  alt="song-img"
                />
                <a
                  href="music-player.html"
                  className=" text-capitalize line-count-1 h5 d-block"
                >
                  winter thunders
                </a>
                <small className="fw-normal text-capitalize line-count-1">
                  winter thunders by rj myoma
                </small>
              </li>
              <li className="col mb-3">
                <img
                  src="../assets/images/dashboard/49.png"
                  className="mb-3 img-fluid rounded-3"
                  alt="song-img"
                />
                <a
                  href="music-player.html"
                  className=" text-capitalize line-count-1 h5 d-block"
                >
                  radio with rive
                </a>
                <small className="fw-normal text-capitalize line-count-1">
                  radio with rive from rj rive
                </small>
              </li>
            </ul>
          </div>
          <div className="row  mb-5">
            <div className="col-lg-12">
              <div className="card-header  mb-3">
                <div className="header-title">
                  <h4 className="card-title text-capitalize">
                    our top listening songs
                  </h4>
                </div>
              </div>
            </div>
              <SongTop />
          </div>
          <ArtistTop />
          <div className="card border-top mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-md-row flex-column gap-3">
                <div className="">
                  <ul className="list-unstyled p-0 m-0 mb-3 text-capitalize d-flex gap-3 flex-md-nowrap flex-wrap">
                    <li>about</li>
                    <li>|</li>
                    <li>terms of use</li>
                    <li>|</li>
                    <li>privacy policy</li>
                    <li>|</li>
                    <li>support</li>
                    <li>|</li>
                    <li>feedback</li>
                    <li>|</li>
                  </ul>
                  <small>
                    Copyright <span id="copyright"></span>. Made with love by
                    Iqonic Design.
                  </small>
                </div>
                <div>
                  <ul className="list-unstyled m-0 p-0 d-flex align-items-center gap-3">
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M5.026 15C11.064 15 14.367 9.99702 14.367 5.66602C14.367 5.52602 14.367 5.38402 14.361 5.24402C15.0041 4.77851 15.5591 4.20217 16 3.54202C15.3993 3.80687 14.7628 3.98143 14.111 4.06002C14.7975 3.64966 15.3117 3.00399 15.558 2.24302C14.913 2.62515 14.207 2.8934 13.471 3.03602C12.9762 2.50905 12.3214 2.15994 11.6081 2.04278C10.8948 1.92562 10.1627 2.04694 9.52534 2.38796C8.88796 2.72897 8.38081 3.27065 8.08245 3.92908C7.78409 4.58751 7.71118 5.32595 7.875 6.03002C6.56974 5.96457 5.29282 5.62549 4.12704 5.03476C2.96127 4.44404 1.93268 3.61487 1.108 2.60102C0.68934 3.3241 0.561574 4.17942 0.750646 4.99329C0.939718 5.80715 1.43145 6.51855 2.126 6.98302C1.60554 6.96534 1.09652 6.82558 0.64 6.57502V6.62002C0.640897 7.3775 0.903307 8.11144 1.38287 8.69778C1.86244 9.28412 2.52975 9.68689 3.272 9.83802C2.99026 9.91564 2.69923 9.95433 2.407 9.95302C2.20098 9.95365 1.99538 9.93456 1.793 9.89602C2.00279 10.5481 2.41127 11.1182 2.96125 11.5265C3.51122 11.9348 4.17513 12.1609 4.86 12.173C3.69656 13.0868 2.2594 13.5824 0.78 13.58C0.519321 13.5811 0.258823 13.5661 0 13.535C1.50151 14.4923 3.2453 15.0006 5.026 15Z"
                          fill="#4A525F"
                        />
                      </svg>
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_389_2574)">
                          <path
                            d="M0 1.146C0 0.513 0.526 0 1.175 0H14.825C15.474 0 16 0.513 16 1.146V14.854C16 15.487 15.474 16 14.825 16H1.175C0.526 16 0 15.487 0 14.854V1.146ZM4.943 13.394V6.169H2.542V13.394H4.943ZM3.743 5.182C4.58 5.182 5.101 4.628 5.101 3.934C5.086 3.225 4.581 2.686 3.759 2.686C2.937 2.686 2.4 3.226 2.4 3.934C2.4 4.628 2.921 5.182 3.727 5.182H3.743ZM8.651 13.394V9.359C8.651 9.143 8.667 8.927 8.731 8.773C8.904 8.342 9.299 7.895 9.963 7.895C10.832 7.895 11.179 8.557 11.179 9.529V13.394H13.58V9.25C13.58 7.03 12.396 5.998 10.816 5.998C9.542 5.998 8.971 6.698 8.651 7.191V7.216H8.635C8.64031 7.20765 8.64564 7.19932 8.651 7.191V6.169H6.251C6.281 6.847 6.251 13.394 6.251 13.394H8.651Z"
                            fill="#4A525F"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_389_2574">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_389_2576)">
                          <path
                            d="M16 8.04902C16 3.60302 12.418 -0.000976562 8.00005 -0.000976562C3.58005 2.34375e-05 -0.00195312 3.60302 -0.00195312 8.05002C-0.00195312 12.067 2.92405 15.397 6.74805 16.001V10.376H4.71805V8.05002H6.75005V6.27502C6.75005 4.25802 7.94505 3.14402 9.77205 3.14402C10.648 3.14402 11.563 3.30102 11.563 3.30102V5.28102H10.554C9.56105 5.28102 9.25105 5.90202 9.25105 6.53902V8.04902H11.469L11.115 10.375H9.25005V16C13.074 15.396 16 12.066 16 8.04902Z"
                            fill="#FF4545"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_389_2576">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_389_2578)">
                          <path
                            d="M8 0C5.829 0 5.556 0.01 4.703 0.048C3.85 0.088 3.269 0.222 2.76 0.42C2.22609 0.620819 1.74249 0.935826 1.343 1.343C0.936076 1.7427 0.621107 2.22624 0.42 2.76C0.222 3.268 0.087 3.85 0.048 4.7C0.01 5.555 0 5.827 0 8.001C0 10.173 0.01 10.445 0.048 11.298C0.088 12.15 0.222 12.731 0.42 13.24C0.625 13.766 0.898 14.212 1.343 14.657C1.787 15.102 2.233 15.376 2.759 15.58C3.269 15.778 3.849 15.913 4.701 15.952C5.555 15.99 5.827 16 8 16C10.173 16 10.444 15.99 11.298 15.952C12.149 15.912 12.732 15.778 13.241 15.58C13.7746 15.3791 14.2578 15.0641 14.657 14.657C15.102 14.212 15.375 13.766 15.58 13.24C15.777 12.731 15.912 12.15 15.952 11.298C15.99 10.445 16 10.173 16 8C16 5.827 15.99 5.555 15.952 4.701C15.912 3.85 15.777 3.268 15.58 2.76C15.3789 2.22623 15.0639 1.74268 14.657 1.343C14.2576 0.935676 13.774 0.620645 13.24 0.42C12.73 0.222 12.148 0.087 11.297 0.048C10.443 0.01 10.172 0 7.998 0H8.001H8ZM7.283 1.442H8.001C10.137 1.442 10.39 1.449 11.233 1.488C12.013 1.523 12.437 1.654 12.719 1.763C13.092 1.908 13.359 2.082 13.639 2.362C13.919 2.642 14.092 2.908 14.237 3.282C14.347 3.563 14.477 3.987 14.512 4.767C14.551 5.61 14.559 5.863 14.559 7.998C14.559 10.133 14.551 10.387 14.512 11.23C14.477 12.01 14.346 12.433 14.237 12.715C14.1087 13.0624 13.904 13.3764 13.638 13.634C13.358 13.914 13.092 14.087 12.718 14.232C12.438 14.342 12.014 14.472 11.233 14.508C10.39 14.546 10.137 14.555 8.001 14.555C5.865 14.555 5.611 14.546 4.768 14.508C3.988 14.472 3.565 14.342 3.283 14.232C2.9355 14.1039 2.62113 13.8996 2.363 13.634C2.09675 13.376 1.89172 13.0617 1.763 12.714C1.654 12.433 1.523 12.009 1.488 11.229C1.45 10.386 1.442 10.133 1.442 7.996C1.442 5.86 1.45 5.608 1.488 4.765C1.524 3.985 1.654 3.561 1.764 3.279C1.909 2.906 2.083 2.639 2.363 2.359C2.643 2.079 2.909 1.906 3.283 1.761C3.565 1.651 3.988 1.521 4.768 1.485C5.506 1.451 5.792 1.441 7.283 1.44V1.442ZM12.271 2.77C12.1449 2.77 12.0201 2.79483 11.9036 2.84308C11.7872 2.89132 11.6813 2.96203 11.5922 3.05118C11.503 3.14032 11.4323 3.24615 11.3841 3.36262C11.3358 3.4791 11.311 3.60393 11.311 3.73C11.311 3.85607 11.3358 3.9809 11.3841 4.09738C11.4323 4.21385 11.503 4.31968 11.5922 4.40882C11.6813 4.49797 11.7872 4.56868 11.9036 4.61692C12.0201 4.66517 12.1449 4.69 12.271 4.69C12.5256 4.69 12.7698 4.58886 12.9498 4.40882C13.1299 4.22879 13.231 3.98461 13.231 3.73C13.231 3.47539 13.1299 3.23121 12.9498 3.05118C12.7698 2.87114 12.5256 2.77 12.271 2.77ZM8.001 3.892C7.45607 3.8835 6.91489 3.98349 6.40898 4.18614C5.90306 4.3888 5.44251 4.69007 5.05415 5.07242C4.66579 5.45478 4.35736 5.91057 4.14684 6.41326C3.93632 6.91595 3.8279 7.4555 3.8279 8.0005C3.8279 8.5455 3.93632 9.08505 4.14684 9.58774C4.35736 10.0904 4.66579 10.5462 5.05415 10.9286C5.44251 11.3109 5.90306 11.6122 6.40898 11.8149C6.91489 12.0175 7.45607 12.1175 8.001 12.109C9.07954 12.0922 10.1082 11.6519 10.865 10.8833C11.6217 10.1146 12.0459 9.07917 12.0459 8.0005C12.0459 6.92183 11.6217 5.88641 10.865 5.11775C10.1082 4.34909 9.07954 3.90883 8.001 3.892ZM8.001 5.333C8.70833 5.333 9.38669 5.61399 9.88685 6.11415C10.387 6.61431 10.668 7.29267 10.668 8C10.668 8.70733 10.387 9.38569 9.88685 9.88585C9.38669 10.386 8.70833 10.667 8.001 10.667C7.29367 10.667 6.61531 10.386 6.11515 9.88585C5.61499 9.38569 5.334 8.70733 5.334 8C5.334 7.29267 5.61499 6.61431 6.11515 6.11415C6.61531 5.61399 7.29367 5.333 8.001 5.333Z"
                            fill="#4A525F"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_389_2578">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PlaybackBar></PlaybackBar>

      <div className="iq-float-menu">
        <input
          type="checkbox"
          name="menu-open"
          id="menu-open"
          className="iq-float-menu-open"
        />
        <label htmlFor="menu-open" className="iq-float-menu-open-button">
          <span className="lines line-1" />
          <span className="lines line-2" />
          <span className="lines line-3" />
        </label>
        <span
          className="iq-float-menu-item bg-primary float-menu-rtl-mode"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Direction Mode"
        >
          <span className="ltr-mode" data-setting="attribute">
            <input
              type="radio"
              defaultValue="ltr"
              className="btn-check"
              name="theme_scheme_direction"
              data-prop="dir"
              id="theme-scheme-direction-ltr"
            />
            <label className="m-o p-0" htmlFor="theme-scheme-direction-ltr">
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </span>
          <span className="rtl-mode" data-setting="attribute">
            <input
              type="radio"
              defaultValue="rtl"
              className="btn-check"
              name="theme_scheme_direction"
              data-prop="dir"
              id="theme-scheme-direction-rtl"
            />
            <label className="m-o p-0" htmlFor="theme-scheme-direction-rtl">
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </span>
        </span>
        <span
          className="iq-float-menu-item bg-info float-menu-color-mode"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Color Mode"
        >
          <span className="light-mode" data-setting="radio">
            <input
              type="radio"
              id="color-mode-light"
              className="btn-check"
              defaultValue="light"
              name="theme_scheme"
            />
            <label
              className="switch-icon-label light-icon"
              htmlFor="color-mode-light"
            >
              <svg
                width={23}
                height={21}
                viewBox="0 0 23 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M15.6999 11.0021C15.6999 13.449 13.7161 15.4328 11.2691 15.4328C8.82218 15.4328 6.83838 13.449 6.83838 11.0021C6.83838 8.55509 8.82218 6.57129 11.2691 6.57129C13.7161 6.57129 15.6999 8.55509 15.6999 11.0021Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.2693 4.50365L11.2693 1.5498"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.2693 20.4543L11.2693 17.5005"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17.7676 11.002L20.7214 11.002"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M1.81691 11.002L4.77075 11.002"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15.8642 6.40654L17.9529 4.31787"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4.58516 17.6858L6.67383 15.5972"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15.8647 15.5969L17.9534 17.6855"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4.58541 4.31807L6.67407 6.40674"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </g>
                <defs>
                  <clipPath>
                    <rect
                      width="21.5385"
                      height={20}
                      fill="white"
                      transform="translate(0.5 0.848145)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </label>
          </span>
          <div className="dark-mode" data-setting="radio">
            <input
              type="radio"
              id="color-mode-dark"
              className="btn-check custom-inputs"
              defaultValue="dark"
              name="theme_scheme"
            />
            <label
              className="switch-icon-label dark-icon"
              htmlFor="color-mode-dark"
            >
              <svg
                width={15}
                height={16}
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.67947 0.610121C7.54098 0.798414 7.51561 1.04704 7.6132 1.25943C8.04109 2.19062 8.25182 3.11105 8.25182 4.13855C8.25182 7.36765 5.53103 10.128 2.03754 10.128C1.66261 10.128 1.27334 10.0371 0.793957 9.92119C0.55797 9.86413 0.309965 9.94489 0.152823 10.13C-0.00431902 10.315 -0.0437864 10.5729 0.0507908 10.7965C1.20467 13.5246 4.00668 15.3481 7.26756 15.3481C11.5607 15.3481 15 11.9261 15 7.84815C15 4.02506 12.0717 0.842474 8.27956 0.353436C8.04774 0.32354 7.81796 0.421827 7.67947 0.610121ZM9.21399 1.86727C11.8368 2.67847 13.7143 5.07555 13.7143 7.84815C13.7143 11.1894 10.8775 14.0624 7.26756 14.0624C4.97916 14.0624 3.00922 13.015 1.85983 11.4093C1.91884 11.4122 1.97811 11.4137 2.03754 11.4137C6.21474 11.4137 9.53753 8.10382 9.53753 4.13855C9.53753 3.34115 9.42909 2.594 9.21399 1.86727Z"
                  fill="currentColor"
                />
              </svg>
            </label>
          </div>
        </span>
        <span
          className="iq-float-menu-item bg-dark float-menu-coming-soon"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Coming Soon"
        >
          <span className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="currentColor"
              className="bi bi-palette"
              viewBox="0 0 16 16"
            >
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
            </svg>
          </span>
        </span>
      </div>
    </>
  );
}
