import React, { useEffect, useState } from "react";
import { FaUpload } from "@react-icons/all-files/fa/FaUpload";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { User } from "../../model/profile/UserProfile";
import { Artist } from "../../model/profile/ArtistProfile";
import ProfileService from "../../services/profileService";

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: User) => void;
  initialData: User;
  token : string;
}

export default function EditProfileDialog({
  visible,
  onClose,
  onSave,
  initialData,
  token
}: EditProfileProps) {
  const [formData, setFormData] = useState<User>({
    user_id: "",
     full_name: "",
     avatar_url: "",
     created_at: "",
     updated_at: "",
     gender: "OTHER",
     cover_url: "",
     role: "USER",
     artist: null
   });
  useEffect(() => {
    setFormData(initialData);
  }, [ initialData ]);
  const isArtist = formData.role === "ARTIST";
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData.artist) {
      setFormData(prev => ({
        ...prev,
        artist: {
          ...prev.artist!,
          [name]: value
        }
      }));
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "MALE" | "FEMALE" | "OTHER";
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };


  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
            ...prev,
            avatar_url: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
            ...prev,
            cover_url: reader.result as string

        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    try{
      const response = await ProfileService.updateUserProfile(formData.user_id, formData, token);
      console.log("Profile updated successfully", response);
      onSave(formData);  
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    }

  }
  if (!visible) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-content" style={modalStyle}>
        <h4 className="mb-4">Edit Profile</h4>
        
        <div className="row">
          {/* Left Column - Images */}
          <div className="col-md-4">
            {/* Avatar */}
            <div className="mb-4 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={formData.avatar_url || "/assets/images/default/avatar.jpg"}
                  alt="Profile Avatar"
                  className="rounded-circle img-thumbnail shadow"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
              </div>
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                  id="avatarUpload"
                />
                <label htmlFor="avatarUpload" className="btn btn-outline-light btn-sm">
                  <FaUpload className="me-2" /> Change Avatar
                </label>
              </div>
            </div>
            
            {/* Cover Image */}
            <div className="mb-4">
              <h6 className="mb-2">Cover Image</h6>
              <div 
                className="rounded mb-2 position-relative" 
                style={{
                  height: "100px",
                  backgroundImage: `url(${formData.cover_url || "/assets/images/default/cover.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  style={{ display: "none" }}
                  id="coverUpload"
                />
                <label htmlFor="coverUpload" className="btn btn-outline-light btn-sm">
                  <FaUpload className="me-2" /> Change Cover
                </label>
              </div>
            </div>
          </div>
          
          {/* Right Column - Form Fields */}
          <div className="col-md-8">
            <div className="row">
              {/* Basic Information */}
              <div className="col-12 mb-4">
                <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
                
                <div className="mb-3">
                  <label className="form-label">
                    <FaUser className="me-2" /> Full Name *
                  </label>
                  <input
                    className="form-control"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={handleGenderChange}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                
              </div>
              
              {/* Artist Information - Only show if user is an artist */}
              {isArtist && formData.artist && (
                <div className="col-12 mb-4">
                  <h5 className="border-bottom pb-2 mb-3">Artist Information</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Stage Name *</label>
                    <input
                      className="form-control"
                      name="stage_name"
                      value={formData.artist.stage_name}
                      onChange={handleArtistChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.artist.bio}
                      onChange={handleArtistChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Facebook URL</label>
                    <input
                      className="form-control"
                      name="facebook_url"
                      value={formData.artist.facebook_url}
                      onChange={handleArtistChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Instagram URL</label>
                    <input
                      className="form-control"
                      name="instagram_url"
                      value={formData.artist.instagram_url}
                      onChange={handleArtistChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">YouTube URL</label>
                    <input
                      className="form-control"
                      name="youtube_url"
                      value={formData.artist.youtube_url}
                      onChange={handleArtistChange}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-outline-light" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleSave()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  overflow: "auto",
  padding: "20px"
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  color: "#1c1c1c",
  padding: "2rem",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "950px",
  maxHeight: "90vh",
  overflowY: "auto"
};