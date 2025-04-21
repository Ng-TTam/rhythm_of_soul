import React, { useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
export default function Sidebar() {
  const navigate = useNavigate();
    const redirectPath = (url : string) => {
        navigate(url);
    }
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/assets/js/sidebarf700.js?v=1.0.1';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handlePlaylist = () => {
    redirectPath('/playlist');
  }
  return (
    <>
      <aside
        className="sidebar sidebar-base sidebar-white sidebar-default"
        id="first-tour"
        data-toggle="main-sidebar"
        data-sidebar="responsive"
      >
        <div className="sidebar-header d-flex align-items-center justify-content-center">
          <a href="index-2.html" className="navbar-brand">
            <div className="logo-main">
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo.svg"
                className="logo-normal img-fluid"
                alt="logo"
              />
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark.svg"
                className="logo-normal dark-normal img-fluid"
                alt="logo-dark"
              />
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo-color.svg"
                className="logo-normal white-normal img-fluid"
                alt="logo-color"
              />
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo-mini.svg"
                className="logo-mini img-fluid"
                alt="logo-mini"
              />
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark-mini.svg"
                className="logo-mini dark-mini img-fluid"
                alt="logo-dark-mini"
              />
              <img
                src="https://templates.iqonic.design/muzik/html/assets/images/logo-color-mini.svg"
                className="logo-mini white-mini img-fluid"
                alt="logo-white-mini"
              />
            </div>
          </a>
          <button
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            style={{border: 'none'}}
          >
            <i className="icon">
              <svg
                className="icon-10"
                width={10}
                height={10}
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.29853 8C7.11974 8 6.94002 7.93083 6.80335 7.79248L3.53927 4.50446C3.40728 4.37085 3.33333 4.18987 3.33333 4.00036C3.33333 3.81179 3.40728 3.63081 3.53927 3.4972L6.80335 0.207279C7.07762 -0.069408 7.52132 -0.069408 7.79558 0.209174C8.06892 0.487756 8.06798 0.937847 7.79371 1.21453L5.02949 4.00036L7.79371 6.78618C8.06798 7.06286 8.06892 7.51201 7.79558 7.79059C7.65892 7.93083 7.47826 8 7.29853 8Z"
                  fill="white"
                />
                <path
                  d="M3.96552 8C3.78673 8 3.60701 7.93083 3.47034 7.79248L0.206261 4.50446C0.0742745 4.37085 0.000325203 4.18987 0.000325203 4.00036C0.000325203 3.81179 0.0742745 3.63081 0.206261 3.4972L3.47034 0.207279C3.74461 -0.069408 4.18831 -0.069408 4.46258 0.209174C4.73591 0.487756 4.73497 0.937847 4.4607 1.21453L1.69649 4.00036L4.4607 6.78618C4.73497 7.06286 4.73591 7.51201 4.46258 7.79059C4.32591 7.93083 4.14525 8 3.96552 8Z"
                  fill="white"
                />
              </svg>
            </i>
          </button>
        </div>
        <div className="sidebar-body pt-0 data-scrollbar">
          <div className="sidebar-list">
            <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
              <li className="nav-item static-item mt-5">
                <a
                  className="nav-link static-item disabled text-start"
                  href="#"
                  tabIndex={-1}
                >
                  <span className="custom-icon default-icon text-uppercase">
                    Main
                  </span>
                  <span
                    className="mini-icon"
                    data-bs-toggle="tooltip"
                    title="Home"
                    data-bs-placement="right"
                  >
                    -
                  </span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="collapse"
                  href="#home-menu"
                  role="button"
                  aria-expanded="false"
                  aria-controls="home-menu"
                >
                  <i
                    className="icon"
                    data-bs-toggle="tooltip"
                    title="Dashboard"
                    data-bs-placement="right"
                  >
                    <svg
                      className="icon-20"
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_389_2893)">
                        <path
                          d="M16.875 16.875V9.02655C16.875 8.93945 16.8568 8.85332 16.8215 8.77367C16.7863 8.69403 16.7348 8.62263 16.6703 8.56405L10.4203 2.66249C10.3052 2.55774 10.1552 2.49969 9.99961 2.49969C9.844 2.49969 9.69399 2.55774 9.57891 2.66249L3.32891 8.56405C3.26459 8.6227 3.21323 8.69413 3.17811 8.77377C3.143 8.85341 3.12491 8.93951 3.125 9.02655V16.875"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.25 16.875H18.75"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.875 16.875V12.5C11.875 12.3342 11.8092 12.1753 11.6919 12.0581C11.5747 11.9408 11.4158 11.875 11.25 11.875H8.75C8.58424 11.875 8.42527 11.9408 8.30806 12.0581C8.19085 12.1753 8.125 12.3342 8.125 12.5V16.875"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_389_2893">
                          <rect width={20} height={20} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </i>
                  <span className="item-name">Home</span>
                  <i className="right-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={18}
                      className="icon-18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </i>
                </a>
                <ul
                  className="sub-nav collapse"
                  id="home-menu"
                  data-bs-parent="#sidebar-menu"
                >
                  <li className="nav-item">
                    <a className="nav-link active" href="index-2.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Dashboard"
                        data-bs-placement="right"
                      >
                        {" "}
                        H
                      </i>
                      <span className="item-name"> Dashboard </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="release.html">
                      <i className="icon svg-icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Release"
                        data-bs-placement="right"
                      >
                        R
                      </i>
                      <span className="item-name">Release</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="albums.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Albums"
                        data-bs-placement="right"
                      >
                        {" "}
                        A
                      </i>
                      <span className="item-name">Albums</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="collapse"
                  href="#admin-menu"
                  role="button"
                  aria-expanded="false"
                  aria-controls="admin-menu"
                >
                  <i
                    className="icon"
                    data-bs-toggle="tooltip"
                    title="Admin"
                    data-bs-placement="right"
                  >
                    <svg
                      className="icon-20"
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_389_2900)">
                        <path
                          d="M8.4375 12.5C11.0263 12.5 13.125 10.4013 13.125 7.8125C13.125 5.22367 11.0263 3.125 8.4375 3.125C5.84867 3.125 3.75 5.22367 3.75 7.8125C3.75 10.4013 5.84867 12.5 8.4375 12.5Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeMiterlimit={10}
                        />
                        <path
                          d="M1.875 15.625C3.48047 13.7148 5.74688 12.5 8.4375 12.5C11.1281 12.5 13.3945 13.7148 15 15.625"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.875 11.875C17.5654 11.875 18.125 11.3154 18.125 10.625C18.125 9.93464 17.5654 9.375 16.875 9.375C16.1846 9.375 15.625 9.93464 15.625 10.625C15.625 11.3154 16.1846 11.875 16.875 11.875Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.875 9.375V8.4375"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.7922 10L14.9805 9.53125"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.7922 11.25L14.9805 11.7188"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.875 11.875V12.8125"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.9578 11.25L18.7695 11.7188"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.9578 10L18.7695 9.53125"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_389_2900">
                          <rect width={20} height={20} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </i>
                  <span className="item-name">Admin</span>
                  <i className="right-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={18}
                      className="icon-18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </i>
                </a>
                <ul
                  className="sub-nav collapse"
                  id="admin-menu"
                  data-bs-parent="#sidebar-menu"
                >
                  <li className="nav-item">
                    <a className="nav-link " href="admin/dashboard.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Admin"
                        data-bs-placement="right"
                      >
                        {" "}
                        A
                      </i>
                      <span className="item-name"> Admin </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="admin/admin-category.html">
                      <i className="icon svg-icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Category"
                        data-bs-placement="right"
                      >
                        {" "}
                        C
                      </i>
                      <span className="item-name">Category</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="admin/admin-writer.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Writer"
                        data-bs-placement="right"
                      >
                        {" "}
                        W
                      </i>
                      <span className="item-name">Writer</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="admin/admin-singer.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Singer"
                        data-bs-placement="right"
                      >
                        {" "}
                        S
                      </i>
                      <span className="item-name">Singer</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="admin/admin-song.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Muzic"
                        data-bs-placement="right"
                      >
                        {" "}
                        M
                      </i>
                      <span className="item-name">Muzic</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="collapse"
                  href="#sidebar-user"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebar-user"
                >
                  <i
                    className="icon"
                    data-bs-toggle="tooltip"
                    title="Users"
                    data-bs-placement="right"
                  >
                    <svg
                      className="icon-20"
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_389_11969)">
                        <path
                          d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 16.875C4.01328 14.2602 6.76172 12.5 10 12.5C13.2383 12.5 15.9867 14.2602 17.5 16.875"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_389_11969">
                          <rect width={20} height={20} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </i>
                  <span className="item-name">Users</span>
                  <i className="right-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={18}
                      className="icon-18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </i>
                </a>
                <ul
                  className="sub-nav collapse"
                  id="sidebar-user"
                  data-bs-parent="#sidebar-menu"
                >
                  <li className="nav-item">
                    <a className="nav-link " href="app/user-profile.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="User Profile"
                        data-bs-placement="right"
                      >
                        {" "}
                        U{" "}
                      </i>
                      <span className="item-name">User Profile</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="app/user-add.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Add User"
                        data-bs-placement="right"
                      >
                        {" "}
                        A
                      </i>
                      <span className="item-name">Add User</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link " style={{border : "0px",backgroundColor : "white"}} onClick={handlePlaylist}>
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="User List"
                        data-bs-placement="right"
                      >
                        {" "}
                        U
                      </i>
                      <span className="item-name">Playlist</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " href="app/user-add.html">
                      <i className="icon">
                        <svg
                          className="icon-10"
                          width={10}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <circle cx={12} cy={12} r={8} fill="currentColor" />
                          </g>
                        </svg>
                      </i>
                      <i
                        className="sidenav-mini-icon"
                        data-bs-toggle="tooltip"
                        title="Add User"
                        data-bs-placement="right"
                      >
                        {" "}
                        A
                      </i>
                      <span className="item-name">Add User</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="scrollbar-track scrollbar-track-x"
          style={{ display: "none" }}
        >
          <div
            className="scrollbar-thumb scrollbar-thumb-x"
            style={{ width: 258, transform: "translate3d(0px, 0px, 0px)" }}
          />
        </div>
        <div
          className="scrollbar-track scrollbar-track-y"
          style={{ display: "none" }}
        >
          <div
            className="scrollbar-thumb scrollbar-thumb-y"
            style={{ height: 724, transform: "translate3d(0px, 0px, 0px)" }}
          />
        </div>
        <div className="sidebar-footer"></div>
      </aside>
    </>
  );
}
