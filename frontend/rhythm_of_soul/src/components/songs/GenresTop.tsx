import React from "react";

export default function GenresTop() {
  const genres = [
    { title: "sorrow", img: "17.png" },
    { title: "relax", img: "18.png" },
    { title: "travel", img: "19.png" },
    { title: "party", img: "20.png" },
    { title: "19’s retro song", img: "21.png" },
    { title: "relax", img: "18.png" },
  ];

  return (
    <div className="container mb-5">
      <div className="card-header mb-3 d-flex justify-content-between align-items-center">
        <h4 className="card-title text-capitalize">top genres for you</h4>
        <div className="common-album position-relative d-lg-block d-none">
          <div className="swiper-button-prev" id="prev1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M15.75 9.5C15.75 9.64918 15.6908 9.79226 15.5853 9.89775C15.4798 10.0032 15.3367 10.0625 15.1875 10.0625H4.17025L8.27298 14.1645C8.32525 14.2168 8.3667 14.2788 8.39499 14.3471C8.42327 14.4154 8.43783 14.4886 8.43783 14.5625C8.43783 14.6364 8.42327 14.7096 8.39499 14.7779C8.3667 14.8462 8.32525 14.9082 8.27298 14.9605C8.22072 15.0127 8.15868 15.0542 8.09039 15.0825C8.02211 15.1108 7.94893 15.1253 7.87502 15.1253C7.80111 15.1253 7.72792 15.1108 7.65964 15.0825C7.59135 15.0542 7.52931 15.0127 7.47705 14.9605L2.41455 9.89797C2.36225 9.84573 2.32076 9.78369 2.29245 9.7154C2.26414 9.64712 2.24957 9.57392 2.24957 9.5C2.24957 9.42608 2.26414 9.35288 2.29245 9.2846C2.32076 9.21631 2.36225 9.15427 2.41455 9.10203L7.47705 4.03953C7.58259 3.93398 7.72575 3.87469 7.87502 3.87469C8.02428 3.87469 8.16744 3.93398 8.27298 4.03953C8.37853 4.14508 8.43783 4.28823 8.43783 4.4375C8.43783 4.58677 8.37853 4.72992 8.27298 4.83547L4.17025 8.9375H15.1875C15.3367 8.9375 15.4798 8.99676 15.5853 9.10225C15.6908 9.20774 15.75 9.35082 15.75 9.5Z"
                fill="#4A525F"
              />
            </svg>
          </div>
          <div className="swiper-button-next" id="next1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M15.5855 9.89797L10.523 14.9605C10.4174 15.066 10.2743 15.1253 10.125 15.1253C9.97573 15.1253 9.83258 15.066 9.72703 14.9605C9.62148 14.8549 9.56219 14.7118 9.56219 14.5625C9.56219 14.4132 9.62148 14.2701 9.72703 14.1645L13.8298 10.0625H2.8125C2.66332 10.0625 2.52024 10.0032 2.41475 9.89775C2.30926 9.79226 2.25 9.64918 2.25 9.5C2.25 9.35082 2.30926 9.20774 2.41475 9.10225C2.52024 8.99676 2.66332 8.9375 2.8125 8.9375H13.8298L9.72703 4.83547C9.62148 4.72992 9.56219 4.58677 9.56219 4.4375C9.56219 4.28823 9.62148 4.14508 9.72703 4.03953C9.83258 3.93398 9.97573 3.87469 10.125 3.87469C10.2743 3.87469 10.4174 3.93398 10.523 4.03953L15.5855 9.10203C15.6378 9.15427 15.6793 9.21631 15.7076 9.2846C15.7359 9.35288 15.7504 9.42608 15.7504 9.5C15.7504 9.57392 15.7359 9.64712 15.7076 9.7154C15.6793 9.78369 15.6378 9.84573 15.5855 9.89797Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="swiper overflow-hidden" data-swiper="geners-slider">
        <ul className="swiper-wrapper d-flex flex-nowrap overflow-auto p-0 list-unstyled mb-0 gap-3">
          {genres.map((item, index) => (
            <li
              className="swiper-slide mb-3 swiper-slide-duplicate"
              style={{ minWidth: "240.667px" }}
              key={index}
            >
              <img
                src={`../assets/images/dashboard/${item.img}`}
                className="mb-3 img-fluid rounded-3"
                alt="song-img"
              />
              <a
                href="music-player.html"
                className="text-capitalize line-count-1 h5 d-block"
              >
                {item.title}
              </a>
              <small className="fw-normal text-capitalize line-count-1">
                top 12 songs from travels and
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// import React from "react";

// export default function GenresTop() {
//   const genres = [
//     { title: "sorrow", img: "17.png" },
//     { title: "relax", img: "18.png" },
//     { title: "travel", img: "19.png" },
//     { title: "party", img: "20.png" },
//     { title: "19’s retro song", img: "21.png" },
//     { title: "relax", img: "18.png" },
//   ];

//   return (
//     <>
//       <div className="col-lg-12 mb-5">
//         <div className="card-header  mb-3">
//           <div className="header-title">
//             <h4 className="card-title text-capitalize">top genres for you</h4>
//           </div>
//           <div className="common-album position-relative d-lg-block d-none">
//             <div
//               className="swiper-button-prev"
//               id="prev1"
//               tabIndex={0}
//               role="button"
//               aria-label="Previous slide"
//               aria-controls="swiper-wrapper-68e57b5cf695aca5"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={18}
//                 height={19}
//                 viewBox="0 0 18 19"
//                 fill="none"
//               >
//                 <path
//                   d="M15.75 9.5C15.75 9.64918 15.6908 9.79226 15.5853 9.89775C15.4798 10.0032 15.3367 10.0625 15.1875 10.0625H4.17025L8.27298 14.1645C8.32525 14.2168 8.3667 14.2788 8.39499 14.3471C8.42327 14.4154 8.43783 14.4886 8.43783 14.5625C8.43783 14.6364 8.42327 14.7096 8.39499 14.7779C8.3667 14.8462 8.32525 14.9082 8.27298 14.9605C8.22072 15.0127 8.15868 15.0542 8.09039 15.0825C8.02211 15.1108 7.94893 15.1253 7.87502 15.1253C7.80111 15.1253 7.72792 15.1108 7.65964 15.0825C7.59135 15.0542 7.52931 15.0127 7.47705 14.9605L2.41455 9.89797C2.36225 9.84573 2.32076 9.78369 2.29245 9.7154C2.26414 9.64712 2.24957 9.57392 2.24957 9.5C2.24957 9.42608 2.26414 9.35288 2.29245 9.2846C2.32076 9.21631 2.36225 9.15427 2.41455 9.10203L7.47705 4.03953C7.58259 3.93398 7.72575 3.87469 7.87502 3.87469C8.02428 3.87469 8.16744 3.93398 8.27298 4.03953C8.37853 4.14508 8.43783 4.28823 8.43783 4.4375C8.43783 4.58677 8.37853 4.72992 8.27298 4.83547L4.17025 8.9375H15.1875C15.3367 8.9375 15.4798 8.99676 15.5853 9.10225C15.6908 9.20774 15.75 9.35082 15.75 9.5Z"
//                   fill="#4A525F"
//                 />
//               </svg>
//             </div>
//             <div
//               className="swiper-button-next"
//               id="next1"
//               tabIndex={0}
//               role="button"
//               aria-label="Next slide"
//               aria-controls="swiper-wrapper-68e57b5cf695aca5"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={18}
//                 height={19}
//                 viewBox="0 0 18 19"
//                 fill="none"
//               >
//                 <path
//                   d="M15.5855 9.89797L10.523 14.9605C10.4174 15.066 10.2743 15.1253 10.125 15.1253C9.97573 15.1253 9.83258 15.066 9.72703 14.9605C9.62148 14.8549 9.56219 14.7118 9.56219 14.5625C9.56219 14.4132 9.62148 14.2701 9.72703 14.1645L13.8298 10.0625H2.8125C2.66332 10.0625 2.52024 10.0032 2.41475 9.89775C2.30926 9.79226 2.25 9.64918 2.25 9.5C2.25 9.35082 2.30926 9.20774 2.41475 9.10225C2.52024 8.99676 2.66332 8.9375 2.8125 8.9375H13.8298L9.72703 4.83547C9.62148 4.72992 9.56219 4.58677 9.56219 4.4375C9.56219 4.28823 9.62148 4.14508 9.72703 4.03953C9.83258 3.93398 9.97573 3.87469 10.125 3.87469C10.2743 3.87469 10.4174 3.93398 10.523 4.03953L15.5855 9.10203C15.6378 9.15427 15.6793 9.21631 15.7076 9.2846C15.7359 9.35288 15.7504 9.42608 15.7504 9.5C15.7504 9.57392 15.7359 9.64712 15.7076 9.7154C15.6793 9.78369 15.6378 9.84573 15.5855 9.89797Z"
//                   fill="currentColor"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div
//           className="swiper overflow-hidden swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
//           data-swiper="geners-slider"
//         >
//           <ul
//             className="swiper-wrapper p-0 list-unstyled mb-0 "
//             id="swiper-wrapper-e8c25d38bea75638"
//             aria-live="polite"
//             // style={{
//             //   transform: "translate3d(-2346px, 0px, 0px)",
//             //   transitionDuration: "0ms",
//             // }}
//           >
//             {genres.map((item, index) => (
//               <li
//                 // key={index}
//                 className="swiper-slide mb-3 swiper-slide-duplicate"
//                 // data-swiper-slide-index={index}
//                 role="group"
//                 // aria-label={`${index + 1} / ${genres.length}`}
//                 style={{ width: "240.667px", marginRight: 20 }}
//               >
//                 <img
//                   src={`assets/images/dashboard/${item.img}`}
//                   className="mb-3 img-fluid rounded-3"
//                   alt={`${item.title}-img`}
//                 />
//                 <a
//                   href="music-player.html"
//                   className=" text-capitalize line-count-1 h5 d-block"
//                 >
//                   {item.title}
//                 </a>
//                 <small className="fw-normal text-capitalize line-count-1">
//                   top 12 songs from {item.title}
//                 </small>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <span
//           className="swiper-notification"
//           aria-live="assertive"
//           aria-atomic="true"
//         />
//       </div>
//     </>
//   );
// }
