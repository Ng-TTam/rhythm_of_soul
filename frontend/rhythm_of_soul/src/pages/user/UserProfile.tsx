import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { User } from "../../model/UserProfile";
import ProfileService from "../../services/profileService";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User>({
    id: "",
    name: "",
    position: "",
    avatar: "",
    description: "",
    bio: "",
    joined: "",
    location: "",
    email: "",
    url: "",
    contact: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ProfileService.getUserProfile(id?.toString() || "");
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const goTo = (path: string) => {navigate(path);console.log(path);}

  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="d-flex flex-wrap align-items-center">
                  <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                    <img
                      src={userData.avatar}
                      alt="User Profile"
                      className="theme-color-default-img img-fluid rounded-pill avatar-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                    <h4 className="me-2 h4">{userData.name}</h4>
                    <span> - {userData.position}</span>
                  </div>
                </div>

                <ul className="d-flex nav nav-pills mb-0 text-center profile-tab" role="tablist">
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={() => goTo("feeds")}>Feeds</button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={() => goTo("follows")}>Follows</button>
                  </li>
                  {userData.role === "artist" && (
                    <>
                      <li className="nav-item">
                        <button className="nav-link btn" onClick={() => goTo("songs")}>Songs</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link btn" onClick={() => goTo("albums")}>Albums</button>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={() => goTo("playlists")}>Playlists</button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={() => goTo("settings")}>Profile</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
