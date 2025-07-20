import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteList from "../components/Notes/NoteList";
import Navbar from "../components/Shared/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Navbar onSearch={setSearchQuery} />
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to Dashboard 🚀</h1>
        <button onClick={handleLogout} className="primary-btn">
          Logout
        </button>
      </div>
      <NoteList searchQuery={searchQuery} />
    </div>
  );
};

export default Dashboard;
