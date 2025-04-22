import React, { useState } from "react";
import Feeds from "./Feeds";
import Profile from "./Profile";
import Follows from "./Follows";
import EditProfileDialog from "./EditProfileDialog";

interface User {
  name: string;
  position: string;
  avatar: string;
  description: string;
  bio: string;
  joined: string;
  location: string;
  email: string;
  url: string;
  contact: string;
  role: "user" | "artist";
}

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [userData, setUserData] = useState(user);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSave = (updated: any) => {
    setUserData((prev) => ({
      ...prev,
      ...updated,
      name: updated.firstName + " " + updated.lastName,
      location: updated.city + ", " + updated.country,
    }));
    setShowEditDialog(false);
  };

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
                    <a className="nav-link active" data-bs-toggle="pill" href="#profile-feeds" role="tab">Feeds</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#profile-follows" role="tab">Follows</a>
                  </li>
                  {user.role === "artist" && (
                    <>
                      <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="pill" href="#profile-songs" role="tab">Songs</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="pill" href="#profile-albums" role="tab">Albums</a>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#profile-playlists" role="tab">Playlists</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#profile-settings" role="tab">Profile</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="tab-content">
            <div id="profile-feeds" className="tab-pane fade show active" role="tabpanel">
              <Feeds
                userName="Anna Sthesia"
                userRole="Colleague"
                userAvatar="/assets/images/dashboard/64.jpg"
                postImage="/assets/images/pages/03-page.jpg"
                postTime="29 mins"
                comments={[
                  {
                    avatar: "/assets/images/dashboard/55.png",
                    name: "Monty Carlo",
                    content: "Lorem ipsum dolor sit amet",
                    time: "5 min"
                  },
                  {
                    avatar: "/assets/images/dashboard/60.png",
                    name: "Paul Molive",
                    content: "Lorem ipsum dolor sit amet",
                    time: "5 min"
                  }
                ]}
              />
            </div>

            <div id="profile-follows" className="tab-pane fade" role="tabpanel">
              <Follows
                follows={[
                  {
                    avatar: "/assets/images/dashboard/55.png",
                    name: "Paul Molive",
                    job: "Web Designer",
                    dropdownId: "dropdownMenuButton9"
                  },
                  {
                    avatar: "/assets/images/dashboard/58.png",
                    name: "Paul Molive",
                    job: "Trainee",
                    dropdownId: "dropdownMenuButton10"
                  },
                  {
                    avatar: "/assets/images/dashboard/59.png",
                    name: "Anna Mull",
                    job: "Web Developer",
                    dropdownId: "dropdownMenuButton11"
                  },
                ]}
              />
            </div>

            <div id="profile-settings" className="tab-pane fade" role="tabpanel">
              <Profile
                name={userData.name}
                role={userData.position}
                description={userData.description}
                avatar={userData.avatar}
                bio={userData.bio}
                joined={userData.joined}
                location={userData.location}
                email={userData.email}
                url={userData.url}
                contact={userData.contact}
                onEdit={() => setShowEditDialog(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hộp thoại chỉnh sửa */}
      <EditProfileDialog
        visible={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSave}
        initialData={{
          name: userData.name,
          firstName: userData.name.split(" ")[0] || "",
          lastName: userData.name.split(" ").slice(1).join(" ") || "",
          avatar: userData.avatar,
          url: userData.url,
          city: userData.location.split(",")[0]?.trim() || "",
          country: userData.location.split(",")[1]?.trim() || "",
          bio: userData.bio,
        }}
      />
    </div>
  );
}