import React, { useState } from "react";

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    avatar: string;
    name: string;
    url: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    bio: string;
  };
}

export default function EditProfileDialog({
  visible,
  onClose,
  onSave,
  initialData
}: EditProfileProps) {
  const [form, setForm] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!visible) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          avatar: reader.result as string // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-content" style={modalStyle}>
        <h2>Edit your Profile</h2>
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
          <div>
            <img
              src={form.avatar}
              alt="Avatar"
              style={{ width: 150, height: 150, borderRadius: "50%" }}
            />
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="avatarUpload"
              />
              <label htmlFor="avatarUpload" className="btn btn-dark" style={{ marginTop: 10, cursor: "pointer" }}>
                Upload image
              </label>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Display name *</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Profile URL *</label>
              <input
                className="form-control"
                name="url"
                value={form.url}
                onChange={handleChange}
              />
            </div>

            <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>First name</label>
                <input
                  className="form-control"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Last name</label>
                <input
                  className="form-control"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>City</label>
                <input
                  className="form-control"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Country</label>
                <input
                  className="form-control"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                className="form-control"
                name="bio"
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => onSave(form)}>
                Save changes
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
  zIndex: 9999
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#1c1c1c",
  color: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  width: "80%",
  maxWidth: "800px"
};
