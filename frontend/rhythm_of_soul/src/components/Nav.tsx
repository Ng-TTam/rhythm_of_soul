import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProfile } from "../services/api/userService";
import { User } from "../model/profile/UserProfile";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { setUserSlice } from "../reducers/userReducer";
import { Collapse } from "bootstrap";
import SearchBox from "./SearchBox";
import Notification from "./Notification";
import useLogout from "../pages/auth/hooks/useLogout";
import { Spinner } from "react-bootstrap";
import GuestNav from "./GuestNav";
import { getUserRole } from "../utils/tokenManager";


const ArtistRegisterModal = lazy(() => import("./artists/RegisterArtistDialog"));

export default function Nav() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const userRole = getUserRole();

  const logout = useLogout();
  const handleLogout = async () => {
    await logout();
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
      {!user ? (
        <GuestNav />
      ) : (
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
                      {userRole === "ROLE_ARTIST" && (
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
                      )}
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
                  {/* Mobile search toggle */}
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
                    <ul className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="search-drop">
                      <li>
                        <div className="iq-search-bar position-relative">
                          <form action="#" className="searchbox">
                            <input type="text" className="form-control bg-soft-primary" placeholder="Search here..." />
                            <button className="d-lg-none d-flex btn btn-link" type="submit">
                              <span className="material-symbols-outlined">search</span>
                            </button>
                          </form>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    {user?.artist === false && <button className="btn btn-soft-primary rounded-pill mb-1" onClick={handleOpen}>Upgrade Artist</button>}

                    {user?.artistProfile?.status === 'PENDING' && <div className="btn btn-outline-warning rounded-pill mt-2">Upgrade Pending</div>}

                    {showModal && (
                      <Suspense fallback={<Spinner animation="border" />}>
                        <ArtistRegisterModal show={showModal} onHide={handleClose} />
                      </Suspense>
                    )}
                  </li>


                  {/* Notifications */}
                  <Notification />

                  {/* User Avatar & Dropdown */}
                  <li className="nav-item dropdown">
                    <a className="p-0 ps-3 nav-link d-flex align-items-center position-relative" href="#" id="profile-setting" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={user?.avatar || "/assets/images/default/avatar.jpg"} alt="User-Profile" className="theme-color-default-img img-fluid avatar avatar-40 avatar-rounded" loading="lazy" />
                      <div className="iq-profile-badge bg-success" />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-setting">
                      <li>
                        <a className="dropdown-item" onClick={(e) => { e.preventDefault(); redirectPath(`/userProfile`); }}>
                          Profile
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">Privacy Setting</a>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
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
      )}
    </>
  );
}
