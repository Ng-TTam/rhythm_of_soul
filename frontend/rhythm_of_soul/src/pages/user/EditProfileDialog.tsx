import React, { useEffect, useState } from "react";
import { FaUpload } from "@react-icons/all-files/fa/FaUpload";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { User } from "../../model/profile/UserProfile";
import { updateUser } from "../../services/api/userService";

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: User) => void;
  initialData: User | null;
}

export default function EditProfileDialog({
  visible,
  onClose,
  onSave,
  initialData,
}: EditProfileProps) {
  const [formData, setFormData] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    avatar: '',
    cover: '',
    artistProfile: {
      id: '',
      stageName: '',
      bio: '',
      facebookUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      status: 'PENDING',
      createdAt: '',
      updatedAt: ''
    },
    createdAt: null,
    updatedAt: null,
    artist: false,
    followerCount: 0,
    followedCount: 0,
  });

  useEffect(() => {
    if(initialData)
      setFormData(initialData);
  }, [initialData]);

  const isArtist = formData.artist;

  // Xử lý thay đổi thông tin user
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi thông tin artist
  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isArtist) {
      setFormData((prev) => ({
        ...prev,
        artistProfile: {
          ...prev.artistProfile!,
          [name]: value,
        },
      }));
    }
  };

  // Xử lý thay đổi giới tính
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'MALE' | 'FEMALE' | 'OTHER';
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  // Xử lý upload avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý upload cover
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          cover: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý lưu profile
  const handleSave = async () => {
    try {
      // console.log('Sending update data:', formData);
      const response = await updateUser(formData.id, formData);
      console.log('Profile updated successfully', response);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

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
                  src={formData.avatar || '/assets/images/default/avatar.jpg'}
                  alt="Profile Avatar"
                  className="rounded-circle img-thumbnail shadow"
                  style={{ width: 150, height: 150, objectFit: 'cover' }}
                />
              </div>
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
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
                  height: '100px',
                  backgroundImage: `url(${formData.cover || '/assets/images/default/cover.png'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  style={{ display: 'none' }}
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
                    <FaUser className="me-2" /> First Name *
                  </label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleUserChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <FaUser className="me-2" /> Last Name *
                  </label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleUserChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleUserChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleUserChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={formData.gender || 'OTHER'}
                    onChange={handleGenderChange}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Artist Information - Only show if user is an artist */}
              {isArtist && formData.artistProfile && (
                <div className="col-12 mb-4">
                  <h5 className="border-bottom pb-2 mb-3">Artist Information</h5>

                  <div className="mb-3">
                    <label className="form-label">Stage Name *</label>
                    <input
                      className="form-control"
                      name="stageName"
                      value={formData.artistProfile.stageName}
                      onChange={handleArtistChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.artistProfile.bio}
                      onChange={handleArtistChange}
                      rows={3}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Facebook URL</label>
                    <input
                      className="form-control"
                      name="facebookUrl"
                      value={formData.artistProfile.facebookUrl}
                      onChange={handleArtistChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Instagram URL</label>
                    <input
                      className="form-control"
                      name="instagramUrl"
                      value={formData.artistProfile.instagramUrl}
                      onChange={handleArtistChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">YouTube URL</label>
                    <input
                      className="form-control"
                      name="youtubeUrl"
                      value={formData.artistProfile.youtubeUrl}
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
              <button className="btn btn-primary" onClick={handleSave}>
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