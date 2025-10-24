import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authslice";
import { toast } from 'react-toastify';
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    API.get("/api/profile/")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile");
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setLoading(true);
      
      const res = await API.patch("/api/profile/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setProfile(res.data);
      setFile(null);
      setPreviewUrl(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!profile.profile_image) {
      toast.info("No profile picture to remove");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_image", ""); 
      
      const res = await API.patch("/api/profile/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(res.data);
      setPreviewUrl(null);
      toast.success("Profile picture removed successfully!");
    } catch (err) {
      console.error("Remove profile picture error:", err);
      toast.error("Failed to remove profile picture");
    } finally {
      setLoading(false);
    }
  };

  const cancelPreview = () => {
    setFile(null);
    setPreviewUrl(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!profile) return <p className="loading-text">Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        <div className="image-section">
          {previewUrl ? (
            <div className="image-with-preview">
              <img
                src={previewUrl}
                alt="Preview"
                className="profile-image"
              />
              <div className="preview-actions">
                <button 
                  type="button" 
                  onClick={cancelPreview}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="update-btn"
                >
                  {loading ? "Updating..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="current-image">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="placeholder-image">👤</div>
              )}
              
              <div className="image-actions">
                <label htmlFor="profile-image-input" className="file-label">
                  Choose Image
                </label>
                <input
                  id="profile-image-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {profile.profile_image && (
                  <button 
                    onClick={removeProfilePicture}
                    disabled={loading}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-info">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>

        <div className="bottom-section">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;