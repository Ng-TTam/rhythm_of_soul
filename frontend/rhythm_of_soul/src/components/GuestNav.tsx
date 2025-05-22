import { useLocation, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";

export default function GuestNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectPath = (url: string) => {
    navigate(url);
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-light iq-navbar">
      <div className="container-fluid navbar-inner">

        {/* Main nav items and search box */}
        <div className="d-flex align-items-center justify-content-between product-offcanvas w-100">
          <div className="offcanvas offcanvas-end shadow-none iq-product-menu-responsive" tabIndex={-1} id="offcanvasBottom">
            <div className="offcanvas-body d-flex align-items-center justify-content-between w-100">

              {/* Nav Menu */}
              <ul className="iq-nav-menu list-unstyled d-flex mb-0">
                <li className="nav-item">
                  <a
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    aria-current="page"
                    onClick={(e) => {
                      e.preventDefault();
                      redirectPath("/");
                    }}
                    href="/"
                  >
                    <span className="item-name" style={{ color: "black" }}>Home</span>
                  </a>
                </li>
              </ul>

              {/* SearchBox */}
              <div className="collapse navbar-collapse justify-content-center" id="guestNavbar">
                <SearchBox />
              </div>

              {/* Login & Signup buttons */}
              <div className="d-flex align-items-center ms-auto gap-2">
                <button className="btn btn-outline-primary" onClick={() => redirectPath("/login")}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={() => redirectPath("/register")}>
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
