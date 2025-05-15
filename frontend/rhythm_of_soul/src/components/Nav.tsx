import React, { useEffect, useRef, useState } from "react";
import LoginService from "../services/service";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProfile } from "../services/api/userService";
import { User } from "../model/profile/UserProfile";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { setUserSlice } from "../reducers/userReducer";
import { Collapse } from "bootstrap";
import Notification from "./Notification";
import SearchBox from "./SearchBox";

export default function Nav() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleLogout = () => {
    const response = LoginService.logout();
    console.log(response);
  };
  const navigate = useNavigate();
  const redirectPath = (url: string) => {
    navigate(url);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await getProfile();
        if (user) {
          dispatch(setUserSlice(user));
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  // insert canvas into nav
  const collapseRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bsCollapse = useRef<Collapse | null>(null);

  useEffect(() => {
    if (collapseRef.current) {
      bsCollapse.current = new Collapse(collapseRef.current, { toggle: false });
    }
  }, []);

  const handleToggle = () => {
    if (bsCollapse.current) {
      if (isCollapsed) {
        bsCollapse.current.hide();
      } else {
        bsCollapse.current.show();
      }
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      <div className="position-relative ">
        <nav className="nav navbar navbar-expand-xl navbar-light iq-navbar">
          <div className="container-fluid navbar-inner">
            <a href="/" className="navbar-brand">
              <div className="logo-main">
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo.svg" className="logo-normal img-fluid" alt="logo" />
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark.svg" className="logo-normal dark-normal img-fluid" alt="logo-dark" />
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-color.svg" className="logo-normal white-normal img-fluid" alt="logo-color" />
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-mini.svg" className="logo-mini img-fluid" alt="logo-mini" />
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark-mini.svg" className="logo-mini dark-mini img-fluid" alt="logo-dark-mini" />
                <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-color-mini.svg" className="logo-mini white-mini img-fluid" alt="logo-white-mini" />
              </div>
            </a>
            <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
              <i className="icon d-flex">
                <svg className="icon-20" width={20} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
              </i>
            </div>
            <div className="d-flex align-items-center justify-content-between product-offcanvas">
              <div className="offcanvas offcanvas-end shadow-none iq-product-menu-responsive" tabIndex={-1} id="offcanvasBottom">
                <div className="offcanvas-body">
                  <ul className="iq-nav-menu list-unstyled">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                        aria-current="page"
                        onClick={(e) => {
                          e.preventDefault();
                          redirectPath(`/`);
                        }}
                      >
                        <span className="item-name">Home</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${location.pathname === "/feed" ? "active" : ""}`}
                        aria-current="page"
                        onClick={(e) => {
                          e.preventDefault();
                          redirectPath(`/feed`);
                        }}
                      >
                        <span className="item-name">Feed</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${location.pathname === "/albums" ? "active" : ""}`}
                        aria-current="page"
                        onClick={(e) => {
                          e.preventDefault();
                          redirectPath(`/albums`);
                        }}
                      >
                        <span className="item-name">Albums</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button id="navbar-toggle" className="navbar-toggler" type="button" aria-expanded={isCollapsed} aria-label="Toggle navigation" onClick={handleToggle}>
                <span className="navbar-toggler-icon">
                  <span className="navbar-toggler-bar bar1 mt-1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={collapseRef}>
              <div className="search-box d-xl-block d-none">
                <SearchBox />
              </div>
              <ul className="mb-2 navbar-nav ms-auto align-items-center navbar-list mb-lg-0">
                <li className="nav-item dropdown d-xl-none d-block">
                  <a href="#" className="nav-link" id="search-drop" data-bs-toggle="dropdown">
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height={2} rx={1} transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                      <path
                        d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end" aria-labelledby="search-drop">
                    <li className="">
                      <div className="p-3 card-header justify-content-between border-bottom rounded-top">
                        <div className="header-title">
                          <div className="iq-search-bar device-search  position-relative">
                            <form action="#" className="searchbox">
                              <input type="text" className="text search-input form-control bg-soft-primary" placeholder="Search here..." />
                              <a className="d-lg-none d-flex" href="javascript:void(0);">
                                <span className="material-symbols-outlined">search</span>
                              </a>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="p-0 card-body all-notification">
                        <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                          <div className="flex-shrink-0">
                            <img src="../assets/images/dashboard/64.jpg" className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                          </div>
                          <div className="d-flex flex-column ms-3 w-100">
                            <a href="javascript:void(0);" className="h6">
                              Alexa Zone
                            </a>
                            <span>Muzic Player</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                          <div className="flex-shrink-0">
                            <img src="../assets/images/dashboard/55.png" className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                          </div>
                          <div className="d-flex flex-column ms-3 w-100">
                            <a href="javascript:void(0);" className="h6">
                              Karuna Trusaa
                            </a>
                            <span>Singer</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center search-hover py-2 px-3 border-bottom">
                          <div className="flex-shrink-0">
                            <img src="../assets/images/dashboard/56.png" className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                          </div>
                          <div className="d-flex flex-column ms-3 w-100">
                            <a href="javascript:void(0);" className="h6">
                              Vibrato Ecruct
                            </a>
                            <span>Playback</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                          <div className="flex-shrink-0">
                            <img src="../assets/images/dashboard/57.png" className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                          </div>
                          <div className="d-flex flex-column ms-3 w-100">
                            <a href="javascript:void(0);" className="h6">
                              Omen Smith
                            </a>
                            <span>Singer</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_549_1300)">
                      <path
                        d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
                        stroke="#AAAAAA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.1601 16.1023C10.0555 16.1023 9.94999 16.1023 9.84765 16.1023L7.34374 17.5C6.36899 17.1721 5.46489 16.6632 4.6789 16L4.66952 13.1875C4.61405 13.1 4.56171 13.0117 4.51327 12.9211L2.02343 11.5031C1.82731 10.5112 1.82731 9.4904 2.02343 8.49844L4.51093 7.08438C4.56171 6.99453 4.61405 6.90547 4.66718 6.81797L4.67968 4.00547C5.46496 3.34035 6.36883 2.82957 7.34374 2.5L9.84374 3.89766C9.94843 3.89766 10.0539 3.89766 10.1562 3.89766L12.6562 2.5C13.631 2.82788 14.5351 3.33679 15.3211 4L15.3305 6.8125C15.3859 6.9 15.4383 6.98828 15.4867 7.07891L17.975 8.49609C18.1711 9.48806 18.1711 10.5088 17.975 11.5008L15.4875 12.9148C15.4367 13.0047 15.3844 13.0938 15.3312 13.1813L15.3187 15.9938C14.534 16.659 13.6307 17.17 12.6562 17.5L10.1601 16.1023Z"
                        stroke="#AAAAAA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_549_1300">
                        <rect width={20} height={20} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </li>
                <Notification  />
                <li className="nav-item dropdown">
                  <a className="p-0 ps-3 nav-link d-flex align-items-center position-relative" href="#" id="profile-setting" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={user?.avatar} alt="User-Profile" className="theme-color-default-img img-fluid avatar avatar-40 avatar-rounded" loading="lazy" />
                    <div className="iq-profile-badge bg-success" />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-setting">
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          redirectPath(`/userProfile`);
                        }}
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="app/user-privacy-setting.html">
                        Privacy Setting
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="/login" onClick={handleLogout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
