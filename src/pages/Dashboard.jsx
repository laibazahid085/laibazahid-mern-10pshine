import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Dashboard 🚀</h1>
      <button onClick={handleLogout} className="primary-btn">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
