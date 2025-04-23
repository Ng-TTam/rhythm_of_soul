import React from "react";

interface ProfileProps {
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
  onEdit?: () => void; // thêm prop onEdit
}

export default function Profile({
  name,
  role,
  description,
  avatar,
  bio,
  joined,
  location,
  email,
  url,
  contact,
  onEdit
}: ProfileProps) {
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
              <img src={avatar} alt="profile-img" className="rounded-pill avatar-130 img-fluid" loading="lazy" />
            </div>
            <div className="mt-3">
              <h3 className="d-inline-block">{name}</h3>
              <p className="d-inline-block ps-2">- {role}</p>
              <p className="mb-0">{description}</p>
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
            <p>{bio}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Joined:</h6>
            <p>{joined}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Lives:</h6>
            <p>{location}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Email:</h6>
            <p><a href={`mailto:${email}`} className="text-body">{email}</a></p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Url:</h6>
            <p><a href={url} className="text-body" target="_blank" rel="noopener noreferrer">{url}</a></p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Contact:</h6>
            <p><a href={`tel:${contact}`} className="text-body">{contact}</a></p>
          </div>

          {/* Nút Edit Profile */}
          <div className="mt-4 d-flex justify-content-center">
            <button className="btn btn-primary" onClick={onEdit}>
              ✏️ Edit Profile
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
