import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Fix: no need to access res.data.user if res.data itself is the user
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
      alert("Could not load profile. Please login again.");
      window.location.href = "/";
    }
  };

  const handleLogout = () => {
    confirmAlert({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("token");
            window.location.href = "/";
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-card">
          <h2>👤 User Profile</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={handleLogout} className="primary-btn">
            🚪 Logout
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="primary-btn"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
