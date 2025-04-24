import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ProfileData {
  name: string;
  role: string;
  description: string;
  avatar: string;
  bio: string;
  joined: string;
  location: string;
  email: string;
  url: string;
  contact: string;
}

export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<ProfileData>({
    name: "",
    role: "",
    description: "",
    avatar: "",
    bio: "",
    joined: "",
    location: "",
    email: "",
    url: "",
    contact: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${id}/profile`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="header-title">
            <h4 className="card-title">Profile</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center">
            <div>
              <img src={userData.avatar} alt="profile-img" className="rounded-pill avatar-130 img-fluid" loading="lazy" />
            </div>
            <div className="mt-3">
              <h3 className="d-inline-block">{userData.name}</h3>
              <p className="d-inline-block ps-2">- {userData.role}</p>
              <p className="mb-0">{userData.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="header-title">
            <h4 className="card-title">About User</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="user-bio">
            <p>{userData.bio}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Joined:</h6>
            <p>{userData.joined}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Lives:</h6>
            <p>{userData.location}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Email:</h6>
            <p><a href={`mailto:${userData.email}`} className="text-body">{userData.email}</a></p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Url:</h6>
            <p><a href={userData.url} className="text-body" target="_blank" rel="noopener noreferrer">{userData.url}</a></p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Contact:</h6>
            <p><a href={`tel:${userData.contact}`} className="text-body">{userData.contact}</a></p>
          </div>
        </div>
        <div className="mt-4 d-flex justify-content-center">
          <button className="btn btn-primary" onClick={() => alert("Edit Profile")}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}
