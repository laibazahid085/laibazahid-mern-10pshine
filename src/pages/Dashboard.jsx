import { useNavigate } from "react-router-dom";
import NoteList from "../Notes/NoteList"; // 🧠 Make sure path is correct
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to Dashboard 🚀</h1>
        <button onClick={handleLogout} className="primary-btn">
          Logout
        </button>
      </div>
   <NoteList />
    </div>
  );
};

export default Dashboard;
